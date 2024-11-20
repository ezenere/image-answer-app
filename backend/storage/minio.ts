import * as Minio from 'minio'

const minioConnection = new Minio.Client({
  endPoint: 'minio',
  port: 9000,
  useSSL: false,
  accessKey: 'DEFAULT',
  secretKey: 'DEFAULT123456789', 
})

export async function minioClient() {
    return minioConnection;
}