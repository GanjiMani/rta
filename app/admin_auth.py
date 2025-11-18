from datetime import datetime, timedelta
import jwt
import logging

SECRET_KEY = "HscgyKJGyu8hjhuHJ"  # use env variable in prod
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

logging.basicConfig(level=logging.DEBUG)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logging.debug(f"Token payload: {payload}")
        return payload
    except jwt.ExpiredSignatureError:
        logging.warning("Token expired")
        return None
    except jwt.PyJWTError as e:
        logging.warning(f"Token decode error: {e}")
        return None
    


    