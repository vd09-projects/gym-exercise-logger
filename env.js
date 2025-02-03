// src/config/envConfig.ts
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _env = require('@env');

var firebaseEnvConfig = {
  apiKey: _env.API_KEY,
  authDomain: _env.AUTH_DOMAIN,
  projectId: _env.PROJECT_ID,
  storageBucket: _env.STORAGE_BUCKET,
  messagingSenderId: _env.MESSAGING_SENDER_ID,
  appId: _env.APP_ID
};
exports.firebaseEnvConfig = firebaseEnvConfig;
