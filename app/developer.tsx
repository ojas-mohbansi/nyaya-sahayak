import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColors } from "@/hooks/useColors";
import { useFontSizes } from "@/hooks/useFontSizes";

const GITHUB_USERNAME = "ojas-mohbansi";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const CACHE_KEY = "nyaya_dev_github_cache";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  Shell: "#89e051",
};

interface GitHubUser {
  name: string;
  login: string;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  topics: string[];
  updated_at: string;
}

interface CachedData {
  user: GitHubUser;
  repos: GitHubRepo[];
  cachedAt: number;
}

async function loadFromCache(): Promise<CachedData | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data: CachedData = JSON.parse(raw);
    if (Date.now() - data.cachedAt > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

async function saveToCache(data: CachedData): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

async function fetchGitHubData(): Promise<CachedData> {
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: { Accept: "application/vnd.github+json" },
    }),
    fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=6&type=owner`,
      { headers: { Accept: "application/vnd.github+json" } },
    ),
  ]);

  if (!userRes.ok) throw new Error(`GitHub API error: ${userRes.status}`);
  const user: GitHubUser = await userRes.json();
  const repos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

  return { user, repos, cachedAt: Date.now() };
}

function SkeletonBox({
  width,
  height,
  radius = 8,
  style,
}: {
  width: number | string;
  height: number;
  radius?: number;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: "#8aabb8",
          opacity,
        },
        style,
      ]}
    />
  );
}

function StatBadge({
  icon,
  label,
  value,
  colors,
  fs,
}: {
  icon: string;
  label: string;
  value: number;
  colors: ReturnType<typeof useColors>;
  fs: ReturnType<typeof useFontSizes>;
}) {
  return (
    <View style={[statStyles.badge, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Feather name={icon as any} size={16} color={colors.primary} />
      <Text style={[statStyles.value, { color: colors.foreground, fontSize: fs.lg }]}>
        {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
      </Text>
      <Text style={[statStyles.label, { color: colors.mutedForeground, fontSize: fs.xs }]}>
        {label}
      </Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  badge: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  value: {
    fontFamily: "Inter_700Bold",
  },
  label: {
    fontFamily: "Inter_400Regular",
  },
});

function RepoCard({
  repo,
  colors,
  fs,
}: {
  repo: GitHubRepo;
  colors: ReturnType<typeof useColors>;
  fs: ReturnType<typeof useFontSizes>;
}) {
  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? "#6b7c93") : null;
  const updatedAgo = (() => {
    const ms = Date.now() - new Date(repo.updated_at).getTime();
    const days = Math.floor(ms / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  })();

  return (
    <Pressable
      onPress={() => Linking.openURL(repo.html_url)}
      style={({ pressed }) => [
        repoStyles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <View style={repoStyles.repoHeader}>
        <Feather name="book" size={14} color={colors.mutedForeground} />
        <Text
          style={[repoStyles.repoName, { color: colors.primary, fontSize: fs.sm }]}
          numberOfLines={1}
        >
          {repo.name}
        </Text>
      </View>
      {repo.description ? (
        <Text
          style={[repoStyles.repoDesc, { color: colors.mutedForeground, fontSize: fs.xs }]}
          numberOfLines={2}
        >
          {repo.description}
        </Text>
      ) : null}
      <View style={repoStyles.repoMeta}>
        {langColor ? (
          <View style={repoStyles.langRow}>
            <View style={[repoStyles.langDot, { backgroundColor: langColor }]} />
            <Text style={[repoStyles.metaText, { color: colors.mutedForeground, fontSize: fs.xs }]}>
              {repo.language}
            </Text>
          </View>
        ) : null}
        <View style={repoStyles.langRow}>
          <Feather name="star" size={11} color={colors.mutedForeground} />
          <Text style={[repoStyles.metaText, { color: colors.mutedForeground, fontSize: fs.xs }]}>
            {repo.stargazers_count}
          </Text>
        </View>
        <View style={repoStyles.langRow}>
          <Feather name="git-branch" size={11} color={colors.mutedForeground} />
          <Text style={[repoStyles.metaText, { color: colors.mutedForeground, fontSize: fs.xs }]}>
            {repo.forks_count}
          </Text>
        </View>
        <Text style={[repoStyles.metaText, { color: colors.mutedForeground, fontSize: fs.xs }]}>
          {updatedAgo}
        </Text>
      </View>
    </Pressable>
  );
}

const repoStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  repoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  repoName: {
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  repoDesc: {
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
  repoMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 2,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  langDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  metaText: {
    fontFamily: "Inter_400Regular",
  },
});

export default function DeveloperScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const fs = useFontSizes();

  const [data, setData] = useState<CachedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async (force = false) => {
    setError(null);
    if (!force) {
      const cached = await loadFromCache();
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }
    }
    try {
      const fresh = await fetchGitHubData();
      await saveToCache(fresh);
      setData(fresh);
    } catch (e: any) {
      setError(e.message ?? "Failed to load developer info");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    load(true);
  }, [load]);

  const handleCopyURL = useCallback(async () => {
    await Clipboard.setStringAsync(GITHUB_PROFILE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleOpenGitHub = useCallback(() => {
    Linking.openURL(GITHUB_PROFILE_URL);
  }, []);

  const memberSince = data?.user.created_at ? new Date(data.user.created_at).getFullYear() : null;

  const [buildExpanded, setBuildExpanded] = useState(false);
  const [buildCopied, setBuildCopied] = useState(false);

  const buildInfo = useMemo(() => {
    const cfg = Constants.expoConfig;
    const buildExtra = (cfg?.extra as { build?: Record<string, string> } | undefined)?.build ?? {};
    const versionCode =
      Platform.OS === "ios" ? cfg?.ios?.buildNumber : cfg?.android?.versionCode?.toString();
    return {
      version: cfg?.version ?? "1.0.0",
      versionCode: versionCode ?? "—",
      bundleId:
        Platform.OS === "ios"
          ? (cfg?.ios?.bundleIdentifier ?? "—")
          : (cfg?.android?.package ?? "—"),
      platform: `${Platform.OS} ${Platform.Version}`,
      runtime: Constants.executionEnvironment ?? "unknown",
      commit: buildExtra.shortCommit ?? "dev",
      profile: buildExtra.profile ?? "local",
      runner: buildExtra.runner ?? "local",
      time: buildExtra.time ?? "—",
    };
  }, []);

  const handleCopyBuildInfo = useCallback(async () => {
    const text = Object.entries(buildInfo)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    await Clipboard.setStringAsync(text);
    setBuildCopied(true);
    setTimeout(() => setBuildCopied(false), 2000);
  }, [buildInfo]);

  const topInsets = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.navy, colors.background]}
        style={[styles.gradientHeader, { paddingTop: topInsets + 8 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.navRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              { backgroundColor: "rgba(255,255,255,0.12)", opacity: pressed ? 0.6 : 1 },
            ]}
            hitSlop={8}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </Pressable>
          <Text style={[styles.navTitle, { fontSize: fs.base }]}>Developer</Text>
          <Pressable
            onPress={handleRefresh}
            style={({ pressed }) => [
              styles.backBtn,
              { backgroundColor: "rgba(255,255,255,0.12)", opacity: pressed ? 0.6 : 1 },
            ]}
            hitSlop={8}
          >
            <Feather name="refresh-cw" size={18} color="#fff" />
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.skeletonContainer}>
            <View style={styles.skeletonProfile}>
              <SkeletonBox width={88} height={88} radius={44} />
              <View style={{ gap: 8, flex: 1 }}>
                <SkeletonBox width="60%" height={18} />
                <SkeletonBox width="40%" height={13} />
                <SkeletonBox width="80%" height={13} />
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {[0, 1, 2, 3].map((i) => (
                <SkeletonBox key={i} width="22%" height={70} radius={12} />
              ))}
            </View>
            {[0, 1, 2].map((i) => (
              <SkeletonBox key={i} width="100%" height={80} radius={12} />
            ))}
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Feather name="wifi-off" size={48} color={colors.mutedForeground} />
            <Text style={[styles.errorTitle, { color: colors.foreground, fontSize: fs.base }]}>
              Could not load profile
            </Text>
            <Text style={[styles.errorSub, { color: colors.mutedForeground, fontSize: fs.sm }]}>
              {error}
            </Text>
            <Pressable
              onPress={() => {
                setLoading(true);
                load(true);
              }}
              style={[styles.retryBtn, { backgroundColor: colors.navy }]}
            >
              <Text style={[styles.retryBtnText, { fontSize: fs.sm }]}>Try Again</Text>
            </Pressable>
          </View>
        ) : data ? (
          <>
            {/* ── Profile card ── */}
            <View
              style={[
                styles.profileCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.profileTop}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{ uri: data.user.avatar_url }}
                    style={styles.avatar}
                    contentFit="cover"
                    transition={300}
                  />
                  <View style={[styles.avatarBadge, { backgroundColor: colors.success }]} />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <Text
                    style={[styles.userName, { color: colors.foreground, fontSize: fs.xl }]}
                    numberOfLines={2}
                  >
                    {data.user.name || data.user.login}
                  </Text>
                  <Text
                    style={[styles.userLogin, { color: colors.mutedForeground, fontSize: fs.sm }]}
                  >
                    @{data.user.login}
                  </Text>
                  {memberSince ? (
                    <Text
                      style={[
                        styles.memberSince,
                        { color: colors.mutedForeground, fontSize: fs.xs },
                      ]}
                    >
                      Member since {memberSince}
                    </Text>
                  ) : null}
                </View>
              </View>

              {data.user.bio ? (
                <Text style={[styles.bio, { color: colors.foreground, fontSize: fs.sm }]}>
                  {data.user.bio}
                </Text>
              ) : null}

              <View style={styles.metaList}>
                {data.user.company ? (
                  <View style={styles.metaRow}>
                    <Feather name="briefcase" size={13} color={colors.mutedForeground} />
                    <Text
                      style={[styles.metaText, { color: colors.mutedForeground, fontSize: fs.xs }]}
                    >
                      {data.user.company}
                    </Text>
                  </View>
                ) : null}
                {data.user.location ? (
                  <View style={styles.metaRow}>
                    <Feather name="map-pin" size={13} color={colors.mutedForeground} />
                    <Text
                      style={[styles.metaText, { color: colors.mutedForeground, fontSize: fs.xs }]}
                    >
                      {data.user.location}
                    </Text>
                  </View>
                ) : null}
                {data.user.blog ? (
                  <Pressable
                    onPress={() => {
                      const url = data.user.blog!.startsWith("http")
                        ? data.user.blog!
                        : `https://${data.user.blog}`;
                      Linking.openURL(url);
                    }}
                    style={styles.metaRow}
                  >
                    <Feather name="link" size={13} color={colors.primary} />
                    <Text style={[styles.metaText, { color: colors.primary, fontSize: fs.xs }]}>
                      {data.user.blog}
                    </Text>
                  </Pressable>
                ) : null}
                {data.user.twitter_username ? (
                  <Pressable
                    onPress={() =>
                      Linking.openURL(`https://twitter.com/${data.user.twitter_username}`)
                    }
                    style={styles.metaRow}
                  >
                    <Feather name="twitter" size={13} color="#1DA1F2" />
                    <Text style={[styles.metaText, { color: "#1DA1F2", fontSize: fs.xs }]}>
                      @{data.user.twitter_username}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>

            {/* ── Stats ── */}
            <View style={styles.statsRow}>
              <StatBadge
                icon="users"
                label="Followers"
                value={data.user.followers}
                colors={colors}
                fs={fs}
              />
              <StatBadge
                icon="user-plus"
                label="Following"
                value={data.user.following}
                colors={colors}
                fs={fs}
              />
              <StatBadge
                icon="code"
                label="Repos"
                value={data.user.public_repos}
                colors={colors}
                fs={fs}
              />
              <StatBadge
                icon="file-text"
                label="Gists"
                value={data.user.public_gists}
                colors={colors}
                fs={fs}
              />
            </View>

            {/* ── Action buttons ── */}
            <View style={styles.actionRow}>
              <Pressable
                onPress={handleOpenGitHub}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  { backgroundColor: colors.navy, opacity: pressed ? 0.8 : 1, flex: 1 },
                ]}
              >
                <Feather name="github" size={18} color="#fff" />
                <Text style={[styles.primaryBtnText, { fontSize: fs.sm }]}>View Profile</Text>
              </Pressable>
              <Pressable
                onPress={handleCopyURL}
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Feather
                  name={copied ? "check" : "copy"}
                  size={18}
                  color={copied ? colors.success : colors.foreground}
                />
              </Pressable>
            </View>

            {/* ── Recent repositories ── */}
            {data.repos.length > 0 ? (
              <>
                <Text
                  style={[styles.sectionTitle, { color: colors.mutedForeground, fontSize: fs.xs }]}
                >
                  RECENT REPOSITORIES
                </Text>
                {data.repos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} colors={colors} fs={fs} />
                ))}
              </>
            ) : null}

            {/* ── Build info ── */}
            <Text
              style={[styles.sectionTitle, { color: colors.mutedForeground, fontSize: fs.xs }]}
            >
              BUILD INFO
            </Text>
            <View
              style={[
                styles.buildCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Pressable
                onPress={() => setBuildExpanded((v) => !v)}
                style={({ pressed }) => [styles.buildHeader, { opacity: pressed ? 0.7 : 1 }]}
              >
                <View style={styles.buildHeaderLeft}>
                  <Feather name="git-commit" size={16} color={colors.primary} />
                  <Text
                    style={[styles.buildHeaderText, { color: colors.foreground, fontSize: fs.sm }]}
                  >
                    {buildInfo.version} · {buildInfo.commit} · {buildInfo.profile}
                  </Text>
                </View>
                <Feather
                  name={buildExpanded ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.mutedForeground}
                />
              </Pressable>
              {buildExpanded ? (
                <View style={styles.buildBody}>
                  {Object.entries(buildInfo).map(([key, value]) => (
                    <View key={key} style={styles.buildRow}>
                      <Text
                        style={[
                          styles.buildKey,
                          { color: colors.mutedForeground, fontSize: fs.xs },
                        ]}
                      >
                        {key}
                      </Text>
                      <Text
                        style={[
                          styles.buildValue,
                          { color: colors.foreground, fontSize: fs.xs },
                        ]}
                        numberOfLines={1}
                      >
                        {value}
                      </Text>
                    </View>
                  ))}
                  <Pressable
                    onPress={handleCopyBuildInfo}
                    style={({ pressed }) => [
                      styles.buildCopyBtn,
                      {
                        borderColor: colors.border,
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Feather
                      name={buildCopied ? "check" : "copy"}
                      size={14}
                      color={buildCopied ? colors.success : colors.foreground}
                    />
                    <Text
                      style={[
                        styles.buildCopyText,
                        {
                          color: buildCopied ? colors.success : colors.foreground,
                          fontSize: fs.xs,
                        },
                      ]}
                    >
                      {buildCopied ? "Copied" : "Copy build info"}
                    </Text>
                  </Pressable>
                </View>
              ) : null}
            </View>

            {/* ── Footer ── */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.mutedForeground, fontSize: fs.xs }]}>
                Data from GitHub API · cached for 1 hour
              </Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  skeletonContainer: {
    gap: 12,
    paddingTop: 4,
  },
  skeletonProfile: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  errorContainer: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  errorTitle: {
    fontFamily: "Inter_600SemiBold",
  },
  errorSub: {
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  profileCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  profileTop: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontFamily: "Inter_700Bold",
  },
  userLogin: {
    fontFamily: "Inter_400Regular",
  },
  memberSince: {
    fontFamily: "Inter_400Regular",
  },
  bio: {
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  metaList: {
    gap: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
  primaryBtnText: {
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  secondaryBtn: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  footer: {
    alignItems: "center",
    paddingTop: 8,
  },
  footerText: {
    fontFamily: "Inter_400Regular",
  },
  buildCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  buildHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  buildHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  buildHeaderText: {
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  buildBody: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    gap: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.08)",
    paddingTop: 10,
  },
  buildRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  buildKey: {
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  buildValue: {
    fontFamily: "Inter_400Regular",
    flex: 1,
    textAlign: "right",
  },
  buildCopyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
  },
  buildCopyText: {
    fontFamily: "Inter_500Medium",
  },
});
