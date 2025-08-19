# Fastlane Integration

Fastlane integration for automated Android app building, signing, and deployment in Hasyx projects.

## Overview

Fastlane is a powerful automation tool for mobile app development that simplifies building, signing, and deploying Android applications. This integration provides:

- **Automated APK building** with Gradle integration
- **APK signing** for release builds
- **AAB (Android App Bundle) generation** for Google Play Store
- **CI/CD integration** with GitHub Actions
- **Multiple build types** (debug, release)
- **Artifact management** for automated workflows

## Quick Start

### Prerequisites

- Ruby 3.2+ installed
- Android SDK configured
- Keystore file for signing (for release builds)

### Installation

```bash
# Navigate to android directory
cd android

# Install fastlane
gem install fastlane

# Verify installation
fastlane --version
```

### Basic Usage

```bash
# Build debug APK
fastlane build_apk build_type:debug

# Build release APK (requires signing credentials)
fastlane build_apk build_type:release

# Build and sign APK
fastlane build_signed_apk build_type:release

# Build AAB for Google Play Store
fastlane build_aab build_type:release

# Clean build artifacts
fastlane clean
```

## Configuration

### Environment Variables

Set these environment variables for signing release builds:

```bash
export KEYSTORE_PATH="/path/to/your/keystore.jks"
export STORE_PASSWORD="your_keystore_password"
export KEY_ALIAS="your_key_alias"
export KEY_PASSWORD="your_key_password"
```

### Keystore Setup

1. **Generate keystore** (if you don't have one):
   ```bash
   keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
   ```

2. **Configure signing** in your `android/app/build.gradle`:
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file(project.hasProperty('KEYSTORE_PATH') ? KEYSTORE_PATH : 'debug.keystore')
               storePassword project.hasProperty('STORE_PASSWORD') ? STORE_PASSWORD : 'android'
               keyAlias project.hasProperty('KEY_ALIAS') ? KEY_ALIAS : 'androiddebugkey'
               keyPassword project.hasProperty('KEY_PASSWORD') ? KEY_PASSWORD : 'android'
           }
       }
       
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled false
               proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

## Available Lanes

### `build_apk`

Builds an APK file using Gradle.

**Parameters:**
- `build_type`: Build type (`debug` or `release`)

**Example:**
```bash
fastlane build_apk build_type:release
```

**What it does:**
1. Runs Gradle build task
2. Finds generated APK
3. Copies APK to artifacts directory
4. Reports success/failure

### `build_signed_apk`

Builds and signs an APK for release.

**Parameters:**
- `build_type`: Build type (defaults to `release`)

**Requirements:**
- All signing environment variables must be set
- Keystore file must exist

**Example:**
```bash
fastlane build_signed_apk build_type:release
```

### `sign_apk`

Signs an existing APK file.

**Requirements:**
- APK must exist in build outputs
- All signing environment variables must be set

**Example:**
```bash
fastlane sign_apk
```

### `build_aab`

Builds an Android App Bundle (AAB) for Google Play Store.

**Parameters:**
- `build_type`: Build type (defaults to `release`)

**Example:**
```bash
fastlane build_aab build_type:release
```

### `deploy_internal`

Deploys signed APK to internal testing track.

**Requirements:**
- Google Play Console API access
- Service account credentials

**Example:**
```bash
fastlane deploy_internal
```

### `clean`

Cleans build artifacts and temporary files.

**Example:**
```bash
fastlane clean
```

## GitHub Actions Integration

### Android Build Workflow

The `android-build.yml` workflow supports fastlane integration:

```yaml
- name: Build with fastlane (if enabled)
  if: github.event.inputs.use_fastlane == 'true'
  run: |
    cd android
    fastlane build_apk build_type:${{ github.event.inputs.build_type || 'debug' }}
```

### Manual Trigger

You can manually trigger builds with fastlane:

1. Go to Actions → Build Android APK
2. Click "Run workflow"
3. Select build type and enable fastlane
4. Click "Run workflow"

### Environment Variables in CI

Set these secrets in your GitHub repository:

- `KEYSTORE_PATH`: Base64 encoded keystore file
- `STORE_PASSWORD`: Keystore password
- `KEY_ALIAS`: Key alias
- `KEY_PASSWORD`: Key password

## Advanced Configuration

### Custom Fastfile

You can extend the Fastfile with custom lanes:

```ruby
# Add to android/fastlane/Fastfile
desc "Custom build with specific configuration"
lane :custom_build do |options|
  # Your custom build logic here
  gradle(
    task: "assembleRelease",
    project_dir: ".",
    properties: {
      "android.injected.signing.store.file" => ENV["KEYSTORE_PATH"],
      "android.injected.signing.store.password" => ENV["STORE_PASSWORD"],
      "android.injected.signing.key.alias" => ENV["KEY_ALIAS"],
      "android.injected.signing.key.password" => ENV["KEY_PASSWORD"],
      "custom.property" => "custom_value"
    }
  )
end
```

### Plugin Integration

Uncomment and configure plugins in `Pluginfile`:

```ruby
# Firebase App Distribution
gem 'fastlane-plugin-firebase_app_distribution'

# Google Play Track Management
gem 'fastlane-plugin-google_play_track'

# Version Management
gem 'fastlane-plugin-versioning'
```

### Multi-Environment Support

Create environment-specific configurations:

```ruby
# android/fastlane/Fastfile
desc "Build for staging environment"
lane :build_staging do
  gradle(
    task: "assembleStaging",
    project_dir: ".",
    properties: {
      "android.injected.signing.store.file" => ENV["STAGING_KEYSTORE_PATH"],
      "android.injected.signing.store.password" => ENV["STAGING_STORE_PASSWORD"],
      "android.injected.signing.key.alias" => ENV["STAGING_KEY_ALIAS"],
      "android.injected.signing.key.password" => ENV["STAGING_KEY_PASSWORD"],
    }
  )
end
```

## Troubleshooting

### Common Issues

**1. Ruby Version Mismatch**
```bash
# Ensure you're using Ruby 3.2+
ruby --version

# Use rbenv or rvm to manage Ruby versions
rbenv install 3.2.2
rbenv local 3.2.2
```

**2. Missing Dependencies**
```bash
# Install required gems
bundle install

# Or install fastlane globally
gem install fastlane
```

**3. Keystore Not Found**
```bash
# Verify keystore path
ls -la $KEYSTORE_PATH

# Check environment variables
echo "KEYSTORE_PATH: $KEYSTORE_PATH"
echo "STORE_PASSWORD: $STORE_PASSWORD"
```

**4. Gradle Build Failures**
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleDebug

# Check Gradle wrapper
./gradlew --version
```

### Debug Mode

Enable verbose output for debugging:

```bash
# Enable fastlane debug mode
FASTLANE_DEBUG=1 fastlane build_apk build_type:debug

# Or use --verbose flag
fastlane build_apk build_type:debug --verbose
```

## Best Practices

### 1. Secure Credential Management

- Never commit keystore files to version control
- Use environment variables or GitHub Secrets
- Rotate keys regularly
- Use different keys for different environments

### 2. Build Optimization

- Enable Gradle build cache
- Use parallel builds when possible
- Optimize ProGuard rules for release builds
- Monitor build times and optimize slow steps

### 3. CI/CD Integration

- Use consistent build environments
- Cache dependencies and build artifacts
- Implement proper error handling
- Add build notifications

### 4. Testing

- Test fastlane lanes locally before CI
- Validate APK signing
- Test different build configurations
- Monitor build success rates

## Examples

### Complete Release Workflow

```bash
# 1. Clean previous builds
fastlane clean

# 2. Build and sign release APK
fastlane build_signed_apk build_type:release

# 3. Build AAB for Play Store
fastlane build_aab build_type:release

# 4. Deploy to internal testing
fastlane deploy_internal
```

### Automated Build Script

```bash
#!/bin/bash
# build-and-deploy.sh

set -e

echo "🚀 Starting Android build and deploy..."

# Build debug APK
echo "📱 Building debug APK..."
fastlane build_apk build_type:debug

# Build release APK
echo "🔐 Building and signing release APK..."
fastlane build_signed_apk build_type:release

# Build AAB
echo "📦 Building AAB..."
fastlane build_aab build_type:release

echo "✅ All builds completed successfully!"
echo "📁 Check artifacts directory for output files"
```

## Related Documentation

- [Android Build System](../README.md#android-build-system)
- [GitHub Actions Workflows](../.github/workflows/)
- [Capacitor Integration](../README.md#capacitor-integration)
- [Mobile App Development](../README.md#mobile-development)

## Support

For fastlane-specific issues:

1. Check [fastlane documentation](https://docs.fastlane.tools/)
2. Review [fastlane GitHub issues](https://github.com/fastlane/fastlane/issues)
3. Check build logs in GitHub Actions
4. Test locally with debug mode enabled

For Hasyx-specific issues:

1. Review project documentation
2. Check GitHub Actions workflow logs
3. Verify environment configuration
4. Test manual build process
