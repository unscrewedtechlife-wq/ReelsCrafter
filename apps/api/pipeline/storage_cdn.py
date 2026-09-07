"""
Storage and CDN Layer (Stages 18 & 19).
Manages structured S3 / MinIO storage paths and CloudFront CDN asset resolution.
"""
from typing import Dict


class StorageAndCDNLayer:
    """
    Allocates structured bucket keys and signs CDN URLs.
    """

    CDN_BASE = "https://cdn.viewmax.ai"

    @classmethod
    def generate_s3_hierarchy(cls, project_id: str, job_id: str) -> Dict[str, str]:
        return {
            "root_prefix": f"projects/{project_id}/jobs/{job_id}/",
            "videos_dir": f"projects/{project_id}/videos/",
            "audio_dir": f"projects/{project_id}/audio/",
            "captions_dir": f"projects/{project_id}/captions/",
            "exports_dir": f"projects/{project_id}/exports/",
            "thumbnails_dir": f"projects/{project_id}/thumbnails/",
            "s3_final_export": f"projects/{project_id}/exports/final_render_1080p.mp4",
            "s3_thumbnail": f"projects/{project_id}/thumbnails/poster_frame_01.jpg",
        }

    @classmethod
    def resolve_cdn_url(cls, s3_path: str) -> str:
        return f"{cls.CDN_BASE}/{s3_path}"
