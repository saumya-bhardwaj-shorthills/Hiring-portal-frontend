import axios from 'axios';

export const getAccessToken = async (instance, account) => {
  const resp = await instance.acquireTokenSilent({
    scopes: ["User.Read","Files.Read","Sites.Read.All"],
    account,
  }).catch(async () => {
    // fallback to popup if silent fails
    const popup = await instance.acquireTokenPopup({
      scopes: ["User.Read","Files.Read","Sites.Read.All"]
    });
    return popup;
  });
  return resp.accessToken;
};

export const getSiteId = (token, siteUrl) =>
  axios.post(
    "http://localhost:8000/api/get-site-id/",
    { site_url: siteUrl },               // use the passed-in value
    { headers: { Authorization: `Bearer ${token}` } }
  ).then(r => r.data.site_id);

export const getDrives = (token, siteId) =>
  axios.post("http://localhost:8000/api/get-drives/",
    { site_id: siteId },
    { headers: { Authorization: `Bearer ${token}` } }
  ).then(r => r.data.drives);

export const fetchResumes = (token, siteId, driveId) =>
  axios.post("http://localhost:8000/api/fetch-resumes/",
    { site_id: siteId, drive_id: driveId },
    { headers: { Authorization: `Bearer ${token}` } }
  ).then(r => r.data);

export const parseResumeApi = (token, siteId, driveId, fileId) =>
  axios.post("http://localhost:8000/api/parse-resume/",
    { file_id: fileId, site_id: siteId, drive_id: driveId },
    { headers: { Authorization: `Bearer ${token}` } }
  ).then(r => r.data.parsed);

export const searchCandidatesApi = (token, keyword) =>
  axios.get("http://localhost:8000/api/search-candidates/",
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { keyword }
    }
  ).then(r => r.data.results);
