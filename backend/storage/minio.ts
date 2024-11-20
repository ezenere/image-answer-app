import * as Minio from 'minio'

const minioConnection = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'q3kxncDvF4SuE42T6uaN',
  secretKey: '9cAfqlKyB3fcAyTvQJ4w0PQ6XDb2Bx7bNsyCbMAa',
})

export async function minioClient() {
    return minioConnection;
}