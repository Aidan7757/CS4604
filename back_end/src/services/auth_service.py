import jwt
import datetime
from functools import wraps
from flask import request, jsonify
import os


class AuthService:
    """
    Simple authentication service for JWT token generation and validation.
    """
    
    # Secret key for JWT -
    SECRET_KEY = os.environ.get('JWT_SECRET_KEY', '')
    ALGORITHM = 'HS256'
    TOKEN_EXPIRATION_HOURS = 24
    
    @staticmethod
    def generate_token(email: str) -> str:
        """
        Generate a JWT token for a user.
        
        Args:
            email: User's email
            
        Returns:
            JWT token as a string
        """
        payload = {
            'email': email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=AuthService.TOKEN_EXPIRATION_HOURS),
            'iat': datetime.datetime.utcnow()
        }
        
        token = jwt.encode(payload, AuthService.SECRET_KEY, algorithm=AuthService.ALGORITHM)
        return token
    
    @staticmethod
    def decode_token(token: str) -> dict:
        """
        Decode and validate a JWT token.
        
        Args:
            token: JWT token string
            
        Returns:
            Decoded payload if valid, None if invalid
        """
        try:
            payload = jwt.decode(token, AuthService.SECRET_KEY, algorithms=[AuthService.ALGORITHM])
            return payload
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return None
    
    @staticmethod
    def extract_token_from_header() -> str:
        """
        Extract JWT token from Authorization header.
        Expected format: "Bearer <token>"
        
        Returns:
            Token string if present, None otherwise
        """
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return None
        
        parts = auth_header.split()
        
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None
        
        return parts[1]
    
    @staticmethod
    def require_auth():
        """
        Decorator to protect endpoints with authentication.
        
        Usage:
            @app.route('/protected')
            @AuthService.require_auth()
            def protected_route():
                return jsonify({'message': 'Success'})
        """
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                # Extract token from header
                token = AuthService.extract_token_from_header()
                
                if not token:
                    return jsonify({
                        'status': 'error',
                        'message': 'Authorization token is missing'
                    }), 401
                
                # Decode and validate token
                payload = AuthService.decode_token(token)
                
                if not payload:
                    return jsonify({
                        'status': 'error',
                        'message': 'Invalid or expired token'
                    }), 401
                
                # Attach user email to request context
                request.user_email = payload.get('email')
                
                return f(*args, **kwargs)
            
            return decorated_function
        return decorator
    
    @staticmethod
    def verify_credentials(email: str, password: str) -> bool:
        """
        Verify user credentials.
        TODO: Replace with actual database lookup.
        
        Args:
            email: User's email
            password: User's password
            
        Returns:
            True if valid, False otherwise
        """
        # Hardcoded users for now - replace with database lookup
        valid_users = {
            'user@example.com': 'password123',
            'admin@example.com': 'admin123'
        }
        
        return valid_users.get(email) == password