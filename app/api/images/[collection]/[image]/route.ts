import { minioClient } from "@/backend/storage/minio";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest, { params }: { params: Promise<{ collection: string, image: string }> }){
    const { collection, image } = await params

    const minio = await minioClient()
    const bucket = 'collection'+collection;

    if(!await minio.bucketExists(bucket)) return new Response('404 Not Found', {
        status: 404
    });

    const dataStream = await minio.getObject(bucket, image)
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new Response(dataStream, {
        status: 200,
        headers: {
            'Content-Type': 'image/jpeg',
            'Content-Disposition': 'inline; filename="image.jpg"'
        }
    });
}