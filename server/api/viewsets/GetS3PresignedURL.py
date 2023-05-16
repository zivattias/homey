from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from uuid import uuid4
import os
import json
import boto3


@api_view(["POST"])
def get_s3_presigned_URL(request, destination, content_type):
    if destination not in ["profile_pics", "apartment_pics"]:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    user = request.user
    if user.is_authenticated:
        uuid = str(uuid4())
        print(uuid)
        object_key = f"{destination}/{uuid}.{content_type}"
        try:
            presigned_url = boto3.client(
                "s3",
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
                aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
                region_name=os.getenv("AWS_REGION_NAME"),
            ).generate_presigned_post(
                os.getenv("AWS_BUCKET_NAME"),
                object_key,
                ExpiresIn=3600,
            )
            return Response(status=status.HTTP_201_CREATED, data=presigned_url)
        except Exception as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"Exception": f"{e.__repr__} f{e.__str__}"},
            )
    return Response(status=status.HTTP_401_UNAUTHORIZED)
