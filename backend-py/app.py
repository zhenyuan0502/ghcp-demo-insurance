from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Database configuration based on DATABASE_TYPE
db_type = os.getenv('DATABASE_TYPE', 'sqlite')

if db_type == 'postgresql':
    # PostgreSQL configuration
    postgres_host = os.getenv('POSTGRES_HOST', 'localhost')
    postgres_port = os.getenv('POSTGRES_PORT', '5432')
    postgres_db = os.getenv('POSTGRES_DB', 'insurance_db')
    postgres_user = os.getenv('POSTGRES_USER', 'insurance_user')
    postgres_password = os.getenv('POSTGRES_PASSWORD', 'insurance_password')
    
    database_url = f"postgresql://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}"
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # SQLite configuration (default)
    sqlite_url = os.getenv('SQLITE_DATABASE_URL', 'sqlite:///insurance.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_url

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

# Models
class Quote(db.Model):
    __tablename__ = 'quote'
    
    id = db.Column(db.Integer, primary_key=True)
    purchaser_name = db.Column(db.String(100), nullable=True)
    insured_name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    insurance_type = db.Column(db.String(20), nullable=False)
    coverage_amount = db.Column(db.String(20), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    premium = db.Column(db.BigInteger)  # Changed to BigInteger for VND (no decimals)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'purchaserName': self.purchaser_name,
            'insuredName': self.insured_name,
            'email': self.email,
            'phone': self.phone,
            'insuranceType': self.insurance_type,
            'coverageAmount': self.coverage_amount,
            'age': self.age,
            'premium': self.premium,
            'status': self.status,
            'createdAt': self.created_at.isoformat()
        }

# Premium calculation logic for VND currency
def calculate_premium(insurance_type, coverage_amount, age):
    # Base rates for VND (monthly premium as percentage of coverage)
    base_rates = {
        'life': 0.0042,      # 0.42% monthly for life insurance
        'auto': 0.0125,      # 1.25% monthly for auto insurance  
        'home': 0.0028,      # 0.28% monthly for home insurance
        'health': 0.0068     # 0.68% monthly for health insurance
    }
    
    # Ensure proper type conversion
    coverage = int(coverage_amount)
    age = int(age)  # Convert age to integer
    base_rate = base_rates.get(insurance_type, 0.0042)
    
    # Age factor for Vietnamese market
    if age < 25:
        age_factor = 1.2     # Young drivers/people higher risk
    elif age < 35:
        age_factor = 1.0     # Prime age, standard rate
    elif age < 50:
        age_factor = 1.1     # Middle age, slight increase
    else:
        age_factor = 1.3     # Senior, higher risk
    
    # Calculate monthly premium in VND (round to nearest 1000 VND)
    premium = coverage * base_rate * age_factor
    return round(premium / 1000) * 1000  # Round to nearest 1000 VND

# Routes
@app.route('/api/quote', methods=['POST'])
def create_quote():
    try:
        data = request.json
          # Calculate premium
        premium = calculate_premium(
            data['insuranceType'], 
            data['coverageAmount'], 
            data['age']
        )
        
        quote = Quote(
            purchaser_name=data.get('purchaserName'),
            insured_name=data.get('insuredName'),
            email=data['email'],
            phone=data['phone'],
            insurance_type=data['insuranceType'],
            coverage_amount=data['coverageAmount'],
            age=data['age'],
            premium=premium
        )
        
        db.session.add(quote)
        db.session.commit()
        
        return jsonify({
            'message': 'Quote created successfully',
            'quote': quote.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/quotes', methods=['GET'])
def get_quotes():
    try:
        quotes = Quote.query.order_by(Quote.created_at.desc()).all()
        return jsonify([quote.to_dict() for quote in quotes])
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/quote/<int:quote_id>', methods=['GET'])
def get_quote(quote_id):
    try:
        quote = Quote.query.get_or_404(quote_id)
        return jsonify(quote.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/quote/<int:quote_id>/status', methods=['PUT'])
@app.route('/api/quotes/<int:quote_id>/status', methods=['PUT'])
def update_quote_status(quote_id):
    try:
        quote = Quote.query.get_or_404(quote_id)
        data = request.json
        quote.status = data['status']
        db.session.commit()
        return jsonify(quote.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/quotes/<int:quote_id>', methods=['DELETE'])
def delete_quote(quote_id):
    try:
        quote = Quote.query.get_or_404(quote_id)
        db.session.delete(quote)
        db.session.commit()
        return jsonify({'message': 'Quote deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
