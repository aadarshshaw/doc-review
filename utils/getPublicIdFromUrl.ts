const getPublicIdFromUrl = (url: String) => {
  const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default getPublicIdFromUrl;
