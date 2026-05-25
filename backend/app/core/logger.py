import logging
import sys
import time
from pathlib import Path
from typing import Callable
from fastapi import Request, Response
from loguru import logger

class InterceptHandler(logging.Handler):
    """
    Intercepts standard Python logging messages and routes them to Loguru.
    This ensures Uvicorn and FastAPI internal logs are formatted identically to yours.
    """
    def emit(self, record):
        # Get corresponding Loguru level if it exists
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Find where the log message originated
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


def setup_logger(environment: str = "development"):
    """
    Configures the logger based on the environment (console + file routing).
    """
    logger.remove() # Remove default Loguru handler
    Path("logs").mkdir(parents=True, exist_ok=True)

    if environment.lower() == "production":
        # 1. Output to Console (Standard for Docker/Cloud services)
        logger.add(
            sys.stdout, 
            serialize=True, 
            level="INFO",
            enqueue=True,
            backtrace=True,
            diagnose=False
        )
        
        # 2. Output to File (Saved on your server's hard drive)
        logger.add(
            "logs/mathpy_prod.log",
            rotation="10 MB",       # Creates a new file when it hits 10MB
            retention="30 days",    # Deletes logs older than 30 days
            compression="zip",      # Zips old files to save disk space
            serialize=True,         # Strict JSON format
            level="INFO",
            enqueue=True,
        )
    else:
        # DEVELOPMENT LOGS
        # 1. Output to Console (Colorful and readable)
        logger.add(
            sys.stdout, 
            colorize=True, 
            format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
            level="DEBUG",
            enqueue=True,
            diagnose=True
        )
        
        # 2. Output to File (Readable text format for local debugging)
        logger.add(
            "logs/mathpy_dev.log",
            rotation="5 MB",
            retention="7 days",
            format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
            level="DEBUG",
            enqueue=True,
        )

    # Intercept standard logging for FastAPI and Uvicorn
    logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)
    for _log in ["uvicorn", "uvicorn.error", "uvicorn.access", "fastapi"]:
        _logger = logging.getLogger(_log)
        _logger.handlers = [InterceptHandler()]
        _logger.propagate = False

    return logger


# ==========================================
# MIDDLEWARE FOR TRACKING REQUESTS
# ==========================================
async def log_requests(request: Request, call_next: Callable) -> Response:
    """
    FastAPI Middleware that logs every incoming request and its processing time.
    """
    start_time = time.time()
    
    # Process the request
    response = await call_next(request)
    
    # Calculate how long it took (in milliseconds)
    process_time = (time.time() - start_time) * 1000
    formatted_process_time = '{0:.2f}'.format(process_time)
    
    # Log the details
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Completed in: {formatted_process_time}ms"
    )
    
    return response