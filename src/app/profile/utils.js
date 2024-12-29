export const gets3Images = async (pfpId, bannerId) => {
  const params = new URLSearchParams();
  const s3Paths = [pfpId, bannerId];
  s3Paths.forEach((imagePath) => {
    params.append('paths', imagePath);
  });
  try {
    const response = await fetch(`/api/s3?${params.toString()}`, {
      method: 'GET',
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error using GET on s3 buckets: ', error.message);
  }
};

export const fetchMediaPathByIds = async (pfpId, bannerId) => {
  try {
    const urlParams = new URLSearchParams();

    if (pfpId) urlParams.append('pfpId', pfpId);
    if (bannerId) urlParams.append('bannerId', bannerId);

    if (!urlParams.toString()) {
      return { pfpPath: null, bannerPath: null };
    }
    const query = urlParams.toString();
    const response = await fetch(`/api/profile/media?${query}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch media path');
    }

    const result = await response.json();
    //   console.log("Got media path from user:", result);
    return result.data; // Safely access the media path
  } catch (error) {
    console.error('Error fetching media path:', error.message);
    throw error;
  }
};

export const deleteCurrentFile = async (currentMediaPath) => {
  const params = new URLSearchParams();
  params.append('paths', currentMediaPath);

  const response = await fetch(`/api/s3?${params.toString()}`, {
    method: 'DELETE',
  });
  const result = await response.json();

  if (response.ok) {
    console.log('Deleted current file from S3:', result);
  } else {
    console.error('Error in deleting:', result.error);
    throw new Error(result.error || 'Failed to delete the file from S3');
  }
};

export const s3UploadNewFile = async (file) => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('path', 'media'); // Define your S3 upload path here

  const response = await fetch(`/api/s3`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Failed to upload the new file to S3');
  }

  return result.data?.[0]; // Return the uploaded path from the S3 upload result
};

export const createNewMedia = async (data, userID, apiCall) => {
  const mediaType = 's3';
  try {
    const response = await fetch(`/api/profile/media`, {
      method: 'POST',
      body: JSON.stringify({
        userId: userID,
        mediaPath: data,
        mediaType: mediaType,
        apiCall: apiCall,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to upload media');
    }
    const result = await response.json();
    console.log('Media uploaded successfully:', result);
  } catch (error) {
    console.error('Error uploading media:', error.message);
  }
};
