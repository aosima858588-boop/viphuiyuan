#!/usr/bin/env node

/**
 * Simple validation script to check project structure
 * This runs without requiring contract compilation
 */

const fs = require('fs');
const path = require('path');

const checks = [
  { name: 'package.json', path: './package.json', type: 'file' },
  { name: 'hardhat.config.js', path: './hardhat.config.js', type: 'file' },
  { name: 'FeeRouterAdapter.sol', path: './contracts/FeeRouterAdapter.sol', type: 'file' },
  { name: 'ExampleERC20.sol', path: './contracts/ExampleERC20.sol', type: 'file' },
  { name: 'MockRouter.sol', path: './contracts/MockRouter.sol', type: 'file' },
  { name: 'deploy.js', path: './scripts/deploy.js', type: 'file' },
  { name: 'test_fee_adapter.js', path: './test/test_fee_adapter.js', type: 'file' },
  { name: '.github/workflows/verify.yml', path: './.github/workflows/verify.yml', type: 'file' },
];

console.log('🔍 Validating project structure...\n');

let allPassed = true;

checks.forEach(check => {
  const fullPath = path.resolve(check.path);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    if (check.type === 'file') {
      const stats = fs.statSync(fullPath);
      console.log(`✅ ${check.name} (${stats.size} bytes)`);
    } else {
      console.log(`✅ ${check.name}`);
    }
  } else {
    console.log(`❌ ${check.name} - MISSING`);
    allPassed = false;
  }
});

console.log('\n📊 Checking contract syntax...\n');

// Check Solidity files for basic syntax
const contracts = [
  './contracts/FeeRouterAdapter.sol',
  './contracts/ExampleERC20.sol',
  './contracts/MockRouter.sol'
];

contracts.forEach(contractPath => {
  const content = fs.readFileSync(contractPath, 'utf8');
  const name = path.basename(contractPath);
  
  // Basic checks
  const hasSpdx = content.includes('SPDX-License-Identifier');
  const hasPragma = content.includes('pragma solidity 0.8.20');
  const hasContract = content.includes('contract ');
  
  if (hasSpdx && hasPragma && hasContract) {
    console.log(`✅ ${name} - syntax looks good`);
  } else {
    console.log(`⚠️  ${name} - potential issues:`, {
      spdx: hasSpdx,
      pragma: hasPragma,
      contract: hasContract
    });
    allPassed = false;
  }
});

console.log('\n📦 Checking package.json configuration...\n');

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const requiredScripts = ['compile', 'test', 'deploy:okx', 'deploy:okx_testnet'];
const requiredDeps = [
  'hardhat',
  '@nomiclabs/hardhat-ethers',
  '@nomiclabs/hardhat-etherscan',
  '@openzeppelin/hardhat-upgrades',
  '@openzeppelin/contracts',
  '@openzeppelin/contracts-upgradeable',
  'ethers'
];

requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`✅ Script: ${script}`);
  } else {
    console.log(`❌ Script missing: ${script}`);
    allPassed = false;
  }
});

requiredDeps.forEach(dep => {
  if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
    console.log(`✅ Dependency: ${dep}`);
  } else {
    console.log(`❌ Dependency missing: ${dep}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('✅ All checks passed!');
  console.log('\nNext steps:');
  console.log('1. npm install');
  console.log('2. npm run compile');
  console.log('3. npm test');
  console.log('4. Set up .env file with your private key');
  console.log('5. npm run deploy:okx_testnet');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please review the output above.');
  process.exit(1);
}
