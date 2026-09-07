import aioboto3
from botocore.exceptions import ClientError
import uuid
from core.config import settings

_session = None


def _get_session():
    global _session
    if _session is None:
        _session = aioboto3.Session(
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY,
            region_name=settings.S3_REGION,
        )
    return _session


async def upload_file(
    file_bytes: bytes,
    bucket: str,
    key: str,
    content_type: str = "application/octet-stream",
) -> str:
    """Upload bytes to S3/MinIO and return the public URL."""
    session = _get_session()
    async with session.client("s3", endpoint_url=settings.S3_ENDPOINT_URL) as s3:
        await s3.put_object(
            Bucket=bucket,
            Key=key,
            Body=file_bytes,
            ContentType=content_type,
        )
    return f"{settings.S3_ENDPOINT_URL}/{bucket}/{key}"


async def generate_presigned_url(bucket: str, key: str, expires_in: int = 3600) -> str:
    """Generate a pre-signed URL for private objects."""
    session = _get_session()
    async with session.client("s3", endpoint_url=settings.S3_ENDPOINT_URL) as s3:
        url = await s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket, "Key": key},
            ExpiresIn=expires_in,
        )
    return url


async def delete_file(bucket: str, key: str) -> None:
    session = _get_session()
    async with session.client("s3", endpoint_url=settings.S3_ENDPOINT_URL) as s3:
        await s3.delete_object(Bucket=bucket, Key=key)


def make_key(prefix: str, user_id: str, filename: str) -> str:
    """Generate a namespaced storage key."""
    ext = filename.rsplit(".", 1)[-1] if "." in filename else "bin"
    return f"{prefix}/{user_id}/{uuid.uuid4().hex}.{ext}"
