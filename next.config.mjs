/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'media4.giphy.com', 'media3.giphy.com', 'media2.giphy.com', 
      'media1.giphy.com', 'media0.giphy.com', 'name-tbd.s3.us-west-1.amazonaws.com',
      'upload.wikimedia.org',
    ], // Add your S3 bucket domain here
  },
  // Uncomment this section if you want to use rewrites as well
  // async rewrites() {
  //   return [
  //     {
  //       source: "/login",
  //       destination: "/accountPages/login",
  //     },
  //     {
  //       source: "/register",
  //       destination: "/accountPages/register",
  //     },
  //   ];
  // }
};

export default nextConfig;
