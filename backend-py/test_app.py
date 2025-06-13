import pytest
import json
import os
import tempfile

# Set test environment before importing app
os.environ['DATABASE_TYPE'] = 'sqlite'
os.environ['SQLITE_DATABASE_URL'] = 'sqlite:///:memory:'

from app import app, db, calculate_premium, Quote

@pytest.fixture
def client():
    """Create a test client with a temporary database."""
    # Create a temporary file for the test database
    db_fd, db_path = tempfile.mkstemp()
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        
        # Clean up after test
        with app.app_context():
            db.drop_all()
    
    os.close(db_fd)
    os.unlink(db_path)

def test_calculate_premium():
    """Test the premium calculation function."""
    # Test life insurance for a 30-year-old with $100,000 coverage
    premium = calculate_premium('life', '100000', 30)
    expected = 1000  # Minimum premium logic
    assert premium == expected

    # Test auto insurance for a 22-year-old with $50,000 coverage
    premium = calculate_premium('auto', '50000', 22)
    expected = round((50000 * 0.0125 * 1.2) / 1000) * 1000
    assert premium == expected

    # Test home insurance for a 55-year-old with $200,000 coverage
    premium = calculate_premium('home', '200000', 55)
    expected = round((200000 * 0.0028 * 1.3) / 1000) * 1000
    assert premium == expected

def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'

def test_create_quote(client):
    """Test creating a new quote."""
    quote_data = {
        'purchaserName': 'John',
        'insuredName': 'Doe',
        'email': 'john.doe@example.com',
        'phone': '123-456-7890',
        'insuranceType': 'life',
        'coverageAmount': '100000',
        'age': 30
    }
    
    response = client.post('/api/quote', 
                          data=json.dumps(quote_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['message'] == 'Quote created successfully'
    assert data['quote']['purchaserName'] == 'John'
    assert data['quote']['insuredName'] == 'Doe'
    assert data['quote']['premium'] > 0

def test_get_quotes_empty(client):
    """Test getting quotes when none exist."""
    response = client.get('/api/quotes')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data == []

def test_get_quotes_with_data(client):
    """Test getting quotes after creating one."""
    # First create a quote
    quote_data = {
        'purchaserName': 'Jane',
        'insuredName': 'Smith',
        'email': 'jane.smith@example.com',
        'phone': '987-654-3210',
        'insuranceType': 'auto',
        'coverageAmount': '50000',
        'age': 25
    }
    
    client.post('/api/quote', 
                data=json.dumps(quote_data),
                content_type='application/json')
    
    # Then get all quotes
    response = client.get('/api/quotes')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 1
    assert data[0]['purchaserName'] == 'Jane'

def test_get_single_quote(client):
    """Test getting a single quote by ID."""
    # First create a quote
    quote_data = {
        'purchaserName': 'Bob',
        'insuredName': 'Johnson',
        'email': 'bob.johnson@example.com',
        'phone': '555-123-4567',
        'insuranceType': 'health',
        'coverageAmount': '75000',
        'age': 40
    }
    
    response = client.post('/api/quote', 
                          data=json.dumps(quote_data),
                          content_type='application/json')
    
    quote_id = json.loads(response.data)['quote']['id']
    
    # Then get the specific quote
    response = client.get(f'/api/quote/{quote_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['purchaserName'] == 'Bob'
    assert data['id'] == quote_id

def test_update_quote_status(client):
    """Test updating a quote's status."""
    # First create a quote
    quote_data = {
        'purchaserName': 'Alice',
        'insuredName': 'Wilson',
        'email': 'alice.wilson@example.com',
        'phone': '777-888-9999',
        'insuranceType': 'home',
        'coverageAmount': '150000',
        'age': 35
    }
    
    response = client.post('/api/quote', 
                          data=json.dumps(quote_data),
                          content_type='application/json')
    
    quote_id = json.loads(response.data)['quote']['id']
    
    # Update the status
    status_data = {'status': 'approved'}
    response = client.put(f'/api/quote/{quote_id}/status',
                         data=json.dumps(status_data),
                         content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'approved'

def test_delete_quote(client):
    """Test deleting a quote."""
    # First create a quote
    quote_data = {
        'purchaserName': 'Charlie',
        'insuredName': 'Brown',
        'email': 'charlie.brown@example.com',
        'phone': '111-222-3333',
        'insuranceType': 'life',
        'coverageAmount': '200000',
        'age': 50
    }
    
    response = client.post('/api/quote', 
                          data=json.dumps(quote_data),
                          content_type='application/json')
    
    quote_id = json.loads(response.data)['quote']['id']
    
    # Delete the quote
    response = client.delete(f'/api/quotes/{quote_id}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Quote deleted successfully'
    
    # Verify it's deleted (the app returns 400 on not found due to exception handling)
    response = client.get(f'/api/quote/{quote_id}')
    assert response.status_code == 400  # App returns 400 instead of 404 due to exception handling

def test_calculate_premium_edge_cases():
    """Test edge cases for premium calculation."""
    # Test very high coverage amount
    premium = calculate_premium('life', '5000000', 25)
    assert premium > 0
    
    # Test edge age values - compare different age groups
    premium_young = calculate_premium('auto', '100000', 18)  # <25, factor 1.2
    premium_prime = calculate_premium('auto', '100000', 30)  # 25-35, factor 1.0
    premium_old = calculate_premium('auto', '100000', 70)    # >=50, factor 1.3
    
    assert premium_young > premium_prime  # Young drivers pay more than prime age
    assert premium_old > premium_prime    # Older drivers pay more than prime age
    
    # Test health insurance
    premium = calculate_premium('health', '100000', 40)
    assert premium > 0
    
    # Test travel insurance (uses default rate)
    premium = calculate_premium('travel', '10000', 30)
    assert premium > 0

def test_create_quote_validation(client):
    """Test quote creation with invalid data."""
    # Test missing required fields
    incomplete_data = {
        'purchaserName': 'John',
        'email': 'john@example.com'
        # Missing other required fields
    }
    
    response = client.post('/api/quote',
                          data=json.dumps(incomplete_data),
                          content_type='application/json')
    
    assert response.status_code == 400

def test_create_quote_with_different_insurance_types(client):
    """Test creating quotes with different insurance types."""
    insurance_types = ['life', 'auto', 'home', 'health', 'travel']
    
    for insurance_type in insurance_types:
        quote_data = {
            'purchaserName': f'Test_{insurance_type}',
            'insuredName': 'User',
            'email': f'test_{insurance_type}@example.com',
            'phone': '123-456-7890',
            'insuranceType': insurance_type,
            'coverageAmount': '100000',
            'age': 30
        }
        
        response = client.post('/api/quote',
                              data=json.dumps(quote_data),
                              content_type='application/json')
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['quote']['insuranceType'] == insurance_type

def test_update_quote_status_invalid_id(client):
    """Test updating status for non-existent quote."""
    status_data = {'status': 'approved'}
    response = client.put('/api/quote/999/status',
                         data=json.dumps(status_data),
                         content_type='application/json')
    
    assert response.status_code == 400

def test_delete_quote_invalid_id(client):
    """Test deleting non-existent quote."""
    response = client.delete('/api/quotes/999')
    assert response.status_code == 400

def test_multiple_quotes_ordering(client):
    """Test that quotes are returned in correct order (newest first)."""
    # Create multiple quotes
    quotes_data = [
        {
            'purchaserName': f'User{i}',
            'insuredName': f'Insured{i}',
            'email': f'user{i}@example.com',
            'phone': '123-456-7890',
            'insuranceType': 'life',
            'coverageAmount': '100000',
            'age': 30 + i
        }
        for i in range(3)
    ]
    
    for quote_data in quotes_data:
        client.post('/api/quote',
                   data=json.dumps(quote_data),
                   content_type='application/json')
    
    # Get all quotes
    response = client.get('/api/quotes')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 3
    
    # Verify ordering (newest first) - User2 should be first
    assert data[0]['purchaserName'] == 'User2'
    assert data[1]['purchaserName'] == 'User1'
    assert data[2]['purchaserName'] == 'User0'