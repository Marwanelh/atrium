import * as S3Sdk from "minio";
import { config } from "@shared/infra/config";
import logger from "@shared/core/logger";

export const siloClient = new S3Sdk.Client({
	endPoint: config.silo.endpoint,
	port: config.silo.port,
	useSSL: config.silo.useSSL,
	accessKey: config.silo.accessKey,
	secretKey: config.silo.secretKey,
});

export const ATRIUM_BUCKET = config.silo.bucketName;

export const initializeSilo = async (): Promise<void> => {
	try {
		const bucketExists = await siloClient.bucketExists(ATRIUM_BUCKET);

		if (!bucketExists) {
			await siloClient.makeBucket(ATRIUM_BUCKET, "us-east-1");
			logger.info(`Silo bucket created: ${ATRIUM_BUCKET}`);
		} else {
			logger.info(`Silo bucket already exists: ${ATRIUM_BUCKET}`);
		}

		// Always ensure the bucket has a public-read policy so direct object
		// URLs (http://silo-host/bucket/key) work without presigning.
		const policy = {
			Version: "2012-10-17",
			Statement: [
				{
					Effect: "Allow",
					Principal: { AWS: ["*"] },
					Action: ["s3:GetObject"],
					Resource: [`arn:aws:s3:::${ATRIUM_BUCKET}/*`],
				},
			],
		};
		await siloClient.setBucketPolicy(ATRIUM_BUCKET, JSON.stringify(policy));
		logger.info(`Silo bucket public-read policy applied: ${ATRIUM_BUCKET}`);
	} catch (error) {
		logger.error("Error initializing Silo:", error);
		throw error;
	}
};

export default siloClient;
