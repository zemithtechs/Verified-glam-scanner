# Fixes a release-build-only crash ("Failed to create an instance of
# androidx.work.impl.WorkDatabase", thrown from androidx.startup.InitializationProvider
# before any Flutter/Dart code runs) caused by R8 full-mode stripping symbols
# that WorkManager's Room database needs via reflection. WorkManager is pulled
# in transitively by firebase_messaging. Debug builds are unaffected since R8
# doesn't run on them, which is why this only ever surfaces in release/Play
# Store builds.
-keep class androidx.work.** { *; }
-keep interface androidx.work.** { *; }
-dontwarn androidx.work.**

-keep class androidx.room.** { *; }
-dontwarn androidx.room.**

-keep class * extends androidx.startup.Initializer
-keep public class androidx.startup.InitializationProvider

# Firebase Messaging (the plugin that pulls WorkManager in)
-keep class com.google.firebase.messaging.** { *; }
-dontwarn com.google.firebase.messaging.**
