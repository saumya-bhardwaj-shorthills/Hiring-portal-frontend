// src/api/sharepoint.js
import axios from 'axios';

export const getAccessToken = async (instance, account) => {
  const resp = await instance.acquireTokenSilent({
    scopes: ["User.Read","Files.Read","Sites.Read.All"],
    account
  });
  return resp.accessToken;
};

export const getSiteId = (token, siteUrl) =>
  axios.post("http://localhost:8000/api/get-site-id/", 
    { site_url: siteUrl },
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
  ).then(r => r.data);

export const getAllCandidates = (token) =>
  axios.get("http://localhost:8000/api/candidates/", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.data);

export const searchCandidatesApi = (token, keyword) =>
  axios.get("http://localhost:8000/api/search-candidates/", {
    headers: { Authorization: `Bearer ${token}` },
    params: { keyword }
  }).then(r => r.data.results);

export const listSites = (token) =>
  axios.get("http://localhost:8000/api/sites/", {
    headers: { Authorization: `Bearer ${token}` },
  }).then(r => r.data);

export const addSite = (token, siteUrl) =>
  axios.post("http://localhost:8000/api/sites/", { site_url: siteUrl }, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(r => r.data);

export const fetchSiteResumes = (token, sitePk) =>
  axios.get(`http://localhost:8000/api/sites/${sitePk}/resumes/`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(r => r.data);