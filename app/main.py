from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import investor_auth, investor,disclosures,admin

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:5173",  # Your React frontend origin
    # You can add other allowed origins here if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow requests from these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(investor_auth.router, prefix="/auth", tags=["auth"])
app.include_router(investor.router, prefix="/investor", tags=["investor"])
app.include_router(disclosures.router, prefix="", tags=["disclosures"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
