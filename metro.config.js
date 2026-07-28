const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Expo's autolinking creates and immediately deletes short-lived
// node_modules/.expo-<module>-<hash> folders on every start. Metro's
// FallbackWatcher (used on Windows without Watchman installed) races
// against that deletion and crashes with ENOENT. These folders are
// never source we need to watch, so block them outright.
config.resolver.blockList = [/[/\\]\.expo-[^/\\]+[/\\]/]

module.exports = config
