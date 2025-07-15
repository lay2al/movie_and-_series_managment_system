const axios = require('axios');

const BASE_URL = 'http://localhost:5001';
let authToken = '';
let adminToken = '';
let testUserId = '';
let testMovieId = '';
let testSeriesId = '';
let testWatchlistId = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function testEndpoint(method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: { ...headers },
      data
    };

    const response = await axios(config);
    console.log(`${colors.green}✓${colors.reset} ${method} ${url} - Status: ${response.status}`);
    return { success: true, data: response.data };
  } catch (error) {
    const status = error.response?.status || 'Network Error';
    const message = error.response?.data?.message || error.message;
    console.log(`${colors.red}✗${colors.reset} ${method} ${url} - Status: ${status} - ${message}`);
    return { success: false, error: message };
  }
}

async function runTests() {
  console.log(`\n${colors.cyan}========== TESTING MOVIE & SERIES MANAGEMENT API ==========${colors.reset}\n`);

  // Test root endpoint
  console.log(`${colors.blue}Testing App Controller:${colors.reset}`);
  await testEndpoint('GET', '/');

  // Test Auth endpoints
  console.log(`\n${colors.blue}Testing Auth Endpoints:${colors.reset}`);
  
  // Register a test user
  const registerResult = await testEndpoint('POST', '/auth/register', {
    email: `testuser_${Date.now()}@example.com`,
    password: 'Test123!@#',
    name: 'Test User'
  });

  // Login with the test user
  const loginResult = await testEndpoint('POST', '/auth/login', {
    email: registerResult.data?.email || `testuser_${Date.now()}@example.com`,
    password: 'Test123!@#'
  });
  
  if (loginResult.success) {
    authToken = loginResult.data.access_token;
    testUserId = loginResult.data.user.id;
  }

  // Try to register an admin (should fail without auth)
  await testEndpoint('POST', '/auth/register-admin', {
    email: `admin_${Date.now()}@example.com`,
    password: 'Admin123!@#',
    name: 'Admin User'
  });

  // Test Movies endpoints
  console.log(`\n${colors.blue}Testing Movie Endpoints:${colors.reset}`);
  
  // Public endpoints
  await testEndpoint('GET', '/movies');
  await testEndpoint('GET', '/movies/search?q=test');
  await testEndpoint('GET', '/movies/1');

  // Admin endpoints (should fail with regular user token)
  const authHeaders = { Authorization: `Bearer ${authToken}` };
  
  const createMovieResult = await testEndpoint('POST', '/movies', {
    title: 'Test Movie',
    synopsis: 'This is a test movie',
    genre: 'Action',
    releaseDate: '2024-01-01',
    director: 'Test Director',
    cast: ['Actor 1', 'Actor 2'],
    duration: 120,
    rating: 8.5
  }, authHeaders);

  await testEndpoint('PUT', '/movies/1', { title: 'Updated Test Movie' }, authHeaders);
  await testEndpoint('DELETE', '/movies/1', null, authHeaders);

  // Test Series endpoints
  console.log(`\n${colors.blue}Testing Series Endpoints:${colors.reset}`);
  
  // Public endpoints
  await testEndpoint('GET', '/series');
  await testEndpoint('GET', '/series/search?q=test');
  await testEndpoint('GET', '/series/1');

  // Admin endpoints (should fail with regular user token)
  const createSeriesResult = await testEndpoint('POST', '/series', {
    title: 'Test Series',
    synopsis: 'This is a test series',
    genre: 'Drama',
    releaseDate: '2024-01-01',
    creator: 'Test Creator',
    cast: ['Actor 1', 'Actor 2'],
    seasons: 1,
    episodes: 10,
    rating: 8.0
  }, authHeaders);

  await testEndpoint('PUT', '/series/1', { title: 'Updated Test Series' }, authHeaders);
  await testEndpoint('DELETE', '/series/1', null, authHeaders);

  // Test User endpoints
  console.log(`\n${colors.blue}Testing User Endpoints:${colors.reset}`);
  
  // Get profile (requires auth)
  await testEndpoint('GET', '/users/profile', null, authHeaders);
  
  // Update profile
  await testEndpoint('PUT', '/users/profile', {
    name: 'Updated Test User',
    email: `updated_${Date.now()}@example.com`
  }, authHeaders);

  // Admin endpoints (should fail with regular user token)
  await testEndpoint('GET', '/users', null, authHeaders);
  await testEndpoint('PUT', `/users/${testUserId}/role`, { role: 'ADMIN' }, authHeaders);
  
  // Delete own account (should work)
  // await testEndpoint('DELETE', `/users/${testUserId}`, null, authHeaders);

  // Test Watchlist endpoints
  console.log(`\n${colors.blue}Testing Watchlist Endpoints:${colors.reset}`);
  
  // All watchlist endpoints require auth
  await testEndpoint('GET', '/watchlist', null, authHeaders);
  await testEndpoint('GET', '/watchlist/movies', null, authHeaders);
  await testEndpoint('GET', '/watchlist/series', null, authHeaders);
  await testEndpoint('GET', '/watchlist/status/WATCHING', null, authHeaders);

  // Add to watchlist
  const addToWatchlistResult = await testEndpoint('POST', '/watchlist', {
    movieId: 1,
    watchStatus: 'WANT_TO_WATCH'
  }, authHeaders);

  if (addToWatchlistResult.success) {
    testWatchlistId = addToWatchlistResult.data.id;
    
    // Get specific watchlist item
    await testEndpoint('GET', `/watchlist/${testWatchlistId}`, null, authHeaders);
    
    // Update watchlist item
    await testEndpoint('PUT', `/watchlist/${testWatchlistId}`, {
      watchStatus: 'WATCHING',
      progress: 50,
      rating: 8
    }, authHeaders);
    
    // Remove from watchlist
    await testEndpoint('DELETE', `/watchlist/${testWatchlistId}`, null, authHeaders);
  }

  // Test with no auth (should fail)
  console.log(`\n${colors.blue}Testing Protected Endpoints Without Auth:${colors.reset}`);
  await testEndpoint('GET', '/users/profile');
  await testEndpoint('GET', '/watchlist');

  // Summary
  console.log(`\n${colors.cyan}========== TEST SUMMARY ==========${colors.reset}`);
  console.log(`${colors.yellow}Note: Some endpoints require admin privileges or specific data to exist in the database.${colors.reset}`);
  console.log(`${colors.yellow}Check the logs above for detailed results.${colors.reset}\n`);
}

// Run the tests
runTests().catch(console.error);