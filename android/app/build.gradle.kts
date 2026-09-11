plugins {
    id("com.android.application")
    id("dev.flutter.flutter-gradle-plugin")
    id("com.google.gms.google-services")
}

import org.gradle.api.tasks.compile.JavaCompile
import java.util.Properties
import java.io.FileInputStream

val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("key.properties")
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

android {
    namespace = "com.verifiedglam.beauty_scanner"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        applicationId = "com.verifiedglam.beauty_scanner"
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
        multiDexEnabled = true
    }

    signingConfigs {
        if (keystorePropertiesFile.exists()) {
            create("release") {
                storeFile = file(keystoreProperties["storeFile"] as String)
                storePassword = keystoreProperties["storePassword"] as String
                keyAlias = keystoreProperties["keyAlias"] as String
                keyPassword = keystoreProperties["keyPassword"] as String
            }
        }
    }

    buildTypes {
        release {
            // Falls back to the debug key only when key.properties is absent
            // (e.g. a fresh checkout before running the release build) so
            // `flutter run --release` locally doesn't hard-fail; the real
            // Play Store build (build-release-apk.ps1) always has it.
            signingConfig = if (keystorePropertiesFile.exists()) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}

// GeneratedPluginRegistrant.java references Kotlin plugin classes; compile them first (AGP 9 ordering).
afterEvaluate {
    tasks.withType(JavaCompile::class.java).configureEach {
        val variant = if (name.contains("Debug")) "Debug" else "Release"
        rootProject.subprojects.forEach { sub ->
            if (sub.name == "app") return@forEach
            sub.tasks.findByName("compile${variant}Kotlin")?.let { kotlinTask ->
                dependsOn(kotlinTask)
            }
        }
    }
}
