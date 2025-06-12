#!/usr/bin/env python3
"""
Test script to verify VND premium calculations
Run this script to test the premium calculation logic for Vietnamese insurance
"""

def calculate_premium_vnd(insurance_type, coverage_amount, age):
    """
    Premium calculation logic for VND currency (matches backend logic)
    """
    # Base rates for VND (monthly premium as percentage of coverage)
    base_rates = {
        'life': 0.0042,      # 0.42% monthly for life insurance
        'auto': 0.0125,      # 1.25% monthly for auto insurance  
        'home': 0.0028,      # 0.28% monthly for home insurance
        'health': 0.0068     # 0.68% monthly for health insurance
    }
    
    # Ensure proper type conversion
    coverage = int(coverage_amount)
    age = int(age)
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

def format_vnd(amount):
    """Format VND amount with thousands separators"""
    return f"{amount:,} VND"

def test_premium_calculations():
    """Test premium calculations with Vietnamese sample data"""
    
    test_cases = [
        # (name, insurance_type, coverage_amount, age, expected_range)
        ("Nguyễn Văn An", "life", "2000000000", 30, (8000000, 9000000)),
        ("Trần Thị Bình", "auto", "1000000000", 25, (12000000, 13000000)),
        ("Lê Minh Cường", "home", "4000000000", 45, (10000000, 12000000)),
        ("Phạm Thu Duyên", "health", "1500000000", 35, (9000000, 11000000)),
        ("Hoàng Văn Em", "life", "3000000000", 28, (12000000, 14000000)),
    ]
    
    print("🧮 Testing VND Premium Calculations")
    print("=" * 60)
    
    for name, insurance_type, coverage_amount, age, expected_range in test_cases:
        premium = calculate_premium_vnd(insurance_type, coverage_amount, age)
        coverage_formatted = format_vnd(int(coverage_amount))
        premium_formatted = format_vnd(premium)
        
        # Check if premium is in expected range
        is_valid = expected_range[0] <= premium <= expected_range[1]
        status = "✅ PASS" if is_valid else "❌ FAIL"
        
        print(f"👤 {name}")
        print(f"   📋 Insurance: {insurance_type.capitalize()}")
        print(f"   💰 Coverage: {coverage_formatted}")
        print(f"   🎂 Age: {age}")
        print(f"   💳 Monthly Premium: {premium_formatted}")
        print(f"   {status}")
        print()

if __name__ == "__main__":
    test_premium_calculations()
    
    print("💡 Premium Calculation Rules:")
    print("   • Life Insurance: 0.42% monthly rate")
    print("   • Auto Insurance: 1.25% monthly rate")
    print("   • Home Insurance: 0.28% monthly rate")
    print("   • Health Insurance: 0.68% monthly rate")
    print("   • Age factors: <25 (+20%), 25-34 (base), 35-49 (+10%), 50+ (+30%)")
    print("   • All premiums rounded to nearest 1,000 VND")
