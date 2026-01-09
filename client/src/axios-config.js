import axios from 'axios';

// Configure axios to use the current page's path as base
// This ensures requests work correctly behind Traefik's path-based routing
// e.g., if page is at /charlie-brown/sqli/, requests will be relative to that
const instance = axios.create({
  baseURL: window.location.pathname.endsWith('/') ? '.' : './',
});

export default instance;
