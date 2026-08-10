import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { presentPaywallModal } from "react-native-purchases-ui";

export default function HomeScreen() {
  const [selectedEdition, setSelectedEdition] = useState("2026");
  const [selectedMode, setSelectedMode] = useState<"book" | "fast" | "quick" | "uglys">("book");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePaywallPress = async () => {
    try {
      if (typeof presentPaywallModal === "function") {
        await presentPaywallModal();
      } else {
        Alert.alert(
          "Upgrade to Pro",
          "Unlock Unlimited NEC Lookup, Industrial PLC Parsing, and Data Center Compliance engines."
        );
      }
    } catch (error) {
      console.log("Paywall modal error:", error);
      Alert.alert(
        "Upgrade to Pro",
        "Unlock Unlimited NEC Lookup, Industrial PLC Parsing, and Data Center Compliance engines."
      );
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert("NEC Search", "Please enter a code question or scenario.");
      return;
    }
    Alert.alert(
      `Searching NEC ${selectedEdition}`,
      `Query: "${searchQuery}"\nMode: ${selectedMode}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#141210" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER BAR */}
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brandSymbol}>⚡</Text>
              <Text style={styles.brandTitle}>CODE COMPASS</Text>
            </View>
            <Text style={styles.brandSubtitle}>ELECTRICAL · PLC · COMPLIANCE</Text>
          </View>
          <TouchableOpacity
            style={styles.proBadgeButton}
            onPress={handlePaywallPress}
            activeOpacity={0.8}
          >
            <Text style={styles.proBadgeText}>PRO ⚡</Text>
          </TouchableOpacity>
        </View>

        {/* EDITION SELECTION BAR */}
        <View style={styles.editionContainer}>
          <Text style={styles.editionLabel}>Active Code Edition:</Text>
          <View style={styles.editionPills}>
            {["2017", "2020", "2023", "2026"].map((edition) => (
              <TouchableOpacity
                key={edition}
                style={[
                  styles.editionPill,
                  selectedEdition === edition && styles.editionPillActive,
                ]}
                onPress={() => setSelectedEdition(edition)}
              >
                <Text
                  style={[
                    styles.editionPillText,
                    selectedEdition === edition && styles.editionPillTextActive,
                  ]}
                >
                  NEC {edition}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.editionSubtext}>
            Every code reference adjusts to match your local jurisdiction.
          </Text>
        </View>

        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={styles.kickerTag}>
            <Text style={styles.kickerText}>BUILT FOR ELECTRICAL APPRENTICES & JOURNEYMEN</Text>
          </View>
          <Text style={styles.heroTitle}>
            Stop Failing the NEC.{"\n"}Master the Code Book with AI.
          </Text>
          <Text style={styles.heroSubtitle}>
            The elite training weapon for electrical apprentices to pass their exam and instantly look up code on the job site.
          </Text>
        </View>

        {/* AI CO-PILOT SEARCH CARD */}
        <View style={styles.searchCard}>
          <View style={styles.searchHeaderRow}>
            <Text style={styles.cardKicker}>WHAT CODE COMPASS DOES</Text>
          </View>
          <Text style={styles.searchCardTitle}>
            One clear path to the code, the logic, and the compliance answer.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Ask a question or paste an NEC scenario..."
              placeholderTextColor="#78716c"
              value={searchQuery}
              onChangeText={setSearchQuery}
              multiline
            />

            <Text style={styles.modeLabel}>Search Strategy:</Text>
            <View style={styles.modesGrid}>
              {[
                { id: "book", label: "Guided Method", icon: "📖" },
                { id: "fast", label: "Index Search", icon: "⚡" },
                { id: "quick", label: "Quick Answer", icon: "💬" },
                { id: "uglys", label: "Ugly's Reference", icon: "📐" },
              ].map((mode) => (
                <TouchableOpacity
                  key={mode.id}
                  style={[
                    styles.modeChip,
                    selectedMode === mode.id && styles.modeChipActive,
                  ]}
                  onPress={() => setSelectedMode(mode.id as any)}
                >
                  <Text style={styles.modeIcon}>{mode.icon}</Text>
                  <Text
                    style={[
                      styles.modeChipText,
                      selectedMode === mode.id && styles.modeChipTextActive,
                    ]}
                  >
                    {mode.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              activeOpacity={0.8}
            >
              <Text style={styles.searchButtonText}>Search Code 🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LIVE CALC WIDGET PREVIEW */}
        <View style={styles.calcPreviewCard}>
          <View style={styles.calcHeaderRow}>
            <Text style={styles.calcTitle}>Box Fill Calc — NEC 314.16</Text>
            <View style={styles.calcLiveBadge}>
              <Text style={styles.calcLiveBadgeText}>LIVE CALC</Text>
            </View>
          </View>

          <View style={styles.calcRows}>
            <View style={styles.calcRow}>
              <Text style={styles.calcRowLabel}>14 AWG × 4</Text>
              <Text style={styles.calcRowValue}>8.00 in³</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcRowLabel}>Clamp (12 AWG)</Text>
              <Text style={styles.calcRowValue}>2.25 in³</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={styles.calcRowLabel}>Device × 2</Text>
              <Text style={styles.calcRowValue}>4.50 in³</Text>
            </View>
          </View>

          <View style={styles.calcTotalRow}>
            <View>
              <Text style={styles.calcTotalLabel}>Total Fill</Text>
              <Text style={styles.calcTotalValue}>14.75 / 18.00 in³</Text>
            </View>
            <View style={styles.passedBadge}>
              <Text style={styles.passedBadgeText}>PASSED ✓</Text>
            </View>
          </View>
        </View>

        {/* THE TRAINING STACK / MODULES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.cardKicker}>THE TRAINING STACK</Text>
          <Text style={styles.sectionTitle}>
            Free tools up front. Premium engines when you're ready.
          </Text>
        </View>

        {/* MODULE 01 - FREE */}
        <View style={styles.moduleCard}>
          <View style={styles.moduleHeaderRow}>
            <Text style={styles.moduleNumber}>MODULE 01</Text>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>FREE</Text>
            </View>
          </View>
          <Text style={styles.moduleTitle}>NEC 2026 Rapid Lookup</Text>
          <Text style={styles.moduleDesc}>
            AI co-pilot for the National Electrical Code. Paste any exam question or field scenario — get the article, section, and answer in seconds.
          </Text>
          <TouchableOpacity
            style={styles.moduleActionButtonFree}
            onPress={handleSearch}
          >
            <Text style={styles.moduleActionTextFree}>Open Lookup →</Text>
          </TouchableOpacity>
        </View>

        {/* MODULE 02 - PREMIUM (PLC) */}
        <View style={[styles.moduleCard, styles.moduleCardPremium]}>
          <View style={styles.moduleHeaderRow}>
            <Text style={styles.moduleNumber}>MODULE 02</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </View>
          </View>
          <Text style={styles.moduleTitle}>Industrial PLC Parsing</Text>
          <Text style={styles.moduleDesc}>
            Upload Rockwell L5K / L5X exports. Parse tags, routines, and rung logic for controls-engineer troubleshooting and code review.
          </Text>
          <TouchableOpacity
            style={styles.moduleActionButtonPremium}
            onPress={handlePaywallPress}
            activeOpacity={0.8}
          >
            <Text style={styles.moduleActionTextPremium}>Unlock PLC Parser 🔒</Text>
          </TouchableOpacity>
        </View>

        {/* MODULE 03 - PREMIUM (Data Center) */}
        <View style={[styles.moduleCard, styles.moduleCardPremium]}>
          <View style={styles.moduleHeaderRow}>
            <Text style={styles.moduleNumber}>MODULE 03</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </View>
          </View>
          <Text style={styles.moduleTitle}>Data Center Compliance</Text>
          <Text style={styles.moduleDesc}>
            Arc-flash boundary calcs and EMS compliance workflows for hyperscale and colo environments. Built to NFPA 70E and NEC Article 645.
          </Text>
          <TouchableOpacity
            style={styles.moduleActionButtonPremium}
            onPress={handlePaywallPress}
            activeOpacity={0.8}
          >
            <Text style={styles.moduleActionTextPremium}>Unlock Compliance Engine 🔒</Text>
          </TouchableOpacity>
        </View>

        {/* JOURNEYMAN EXAM PREP SECTION */}
        <View style={styles.examCard}>
          <Text style={styles.cardKicker}>SHARPEN YOUR LICENSE TRACK</Text>
          <Text style={styles.examTitle}>Journeyman Exam Prep</Text>
          <Text style={styles.examDesc}>
            Timed NEC drills and a full 25-question practice test. Read the answer, keep moving.
          </Text>
          <View style={styles.examButtonsRow}>
            <TouchableOpacity
              style={styles.examPrimaryButton}
              onPress={() => Alert.alert("Practice Test", "Launching 25-Question NEC Practice Test...")}
            >
              <Text style={styles.examPrimaryButtonText}>25-Question Test →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.examSecondaryButton}
              onPress={() => Alert.alert("Timed Drills", "Starting Timed Drills...")}
            >
              <Text style={styles.examSecondaryButtonText}>Timed Drills</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PRIMARY PRO CTA / PAYWALL BANNER */}
        <View style={styles.proCtaCard}>
          <View style={styles.proCtaHeader}>
            <Text style={styles.proCtaBadge}>UNLIMITED ACCESS</Text>
            <Text style={styles.proCtaTitle}>Upgrade to Code Compass Pro</Text>
            <Text style={styles.proCtaDesc}>
              Master the NEC exam, automate PLC ladder parsing, and calculate arc-flash boundaries on active job sites.
            </Text>
          </View>

          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>✓ Unlimited AI NEC Co-Pilot Code Queries</Text>
            <Text style={styles.featureItem}>✓ Rockwell L5X/L5K Industrial PLC Parser</Text>
            <Text style={styles.featureItem}>✓ Data Center Arc-Flash & NFPA 70E Calcs</Text>
            <Text style={styles.featureItem}>✓ Timed Journeyman License Exam Drills</Text>
          </View>

          <TouchableOpacity
            style={styles.upgradeProButton}
            onPress={handlePaywallPress}
            activeOpacity={0.85}
          >
            <Text style={styles.upgradeProButtonText}>Upgrade to Pro ⚡</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Code Compass · Built for Electricians, Apprentices & Journeymen
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141210",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2c2824",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandSymbol: {
    fontSize: 20,
    color: "#f97316",
    marginRight: 6,
  },
  brandTitle: {
    color: "#f5f4f0",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    color: "#a8a29e",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 2,
  },
  proBadgeButton: {
    backgroundColor: "#2a2016",
    borderColor: "#f97316",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  proBadgeText: {
    color: "#fbbf24",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  editionContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#1c1a17",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2c2824",
  },
  editionLabel: {
    color: "#a8a29e",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  editionPills: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editionPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#141210",
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: "#2c2824",
  },
  editionPillActive: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },
  editionPillText: {
    color: "#a8a29e",
    fontSize: 12,
    fontWeight: "600",
  },
  editionPillTextActive: {
    color: "#ffffff",
    fontWeight: "800",
  },
  editionSubtext: {
    color: "#78716c",
    fontSize: 10,
    marginTop: 8,
    textAlign: "center",
  },
  heroSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  kickerTag: {
    alignSelf: "flex-start",
    backgroundColor: "#2a2016",
    borderColor: "#f97316",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  kickerText: {
    color: "#fbbf24",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  heroTitle: {
    color: "#f5f4f0",
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: "#a8a29e",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  searchCard: {
    backgroundColor: "#1c1a17",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2c2824",
    marginTop: 12,
  },
  searchHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardKicker: {
    color: "#f97316",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  searchCardTitle: {
    color: "#f5f4f0",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  inputContainer: {
    backgroundColor: "#141210",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2c2824",
  },
  searchInput: {
    color: "#f5f4f0",
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modeLabel: {
    color: "#a8a29e",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  modesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1a17",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2c2824",
  },
  modeChipActive: {
    backgroundColor: "#2a2016",
    borderColor: "#f97316",
  },
  modeIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  modeChipText: {
    color: "#a8a29e",
    fontSize: 11,
    fontWeight: "600",
  },
  modeChipTextActive: {
    color: "#f97316",
    fontWeight: "800",
  },
  searchButton: {
    backgroundColor: "#f97316",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 14,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  calcPreviewCard: {
    backgroundColor: "#1c1a17",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2c2824",
    marginTop: 16,
  },
  calcHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  calcTitle: {
    color: "#f5f4f0",
    fontSize: 13,
    fontWeight: "800",
  },
  calcLiveBadge: {
    backgroundColor: "#2a2016",
    borderColor: "#f97316",
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  calcLiveBadgeText: {
    color: "#fbbf24",
    fontSize: 9,
    fontWeight: "800",
  },
  calcRows: {
    borderBottomWidth: 1,
    borderBottomColor: "#2c2824",
    paddingBottom: 8,
    marginBottom: 8,
  },
  calcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  calcRowLabel: {
    color: "#a8a29e",
    fontSize: 12,
  },
  calcRowValue: {
    color: "#f5f4f0",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  calcTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calcTotalLabel: {
    color: "#a8a29e",
    fontSize: 10,
    textTransform: "uppercase",
  },
  calcTotalValue: {
    color: "#f97316",
    fontSize: 14,
    fontWeight: "800",
    fontFamily: "monospace",
  },
  passedBadge: {
    backgroundColor: "#142918",
    borderColor: "#22c55e",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  passedBadgeText: {
    color: "#22c55e",
    fontSize: 11,
    fontWeight: "800",
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#f5f4f0",
    fontSize: 20,
    fontWeight: "800",
  },
  moduleCard: {
    backgroundColor: "#1c1a17",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2c2824",
    marginBottom: 12,
  },
  moduleCardPremium: {
    borderColor: "#3d2d1e",
  },
  moduleHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  moduleNumber: {
    color: "#a8a29e",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  freeBadge: {
    backgroundColor: "#142918",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  freeBadgeText: {
    color: "#22c55e",
    fontSize: 10,
    fontWeight: "800",
  },
  premiumBadge: {
    backgroundColor: "#2a2016",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumBadgeText: {
    color: "#fbbf24",
    fontSize: 10,
    fontWeight: "800",
  },
  moduleTitle: {
    color: "#f5f4f0",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  moduleDesc: {
    color: "#a8a29e",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  moduleActionButtonFree: {
    backgroundColor: "#25221e",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#38322c",
  },
  moduleActionTextFree: {
    color: "#f5f4f0",
    fontSize: 13,
    fontWeight: "700",
  },
  moduleActionButtonPremium: {
    backgroundColor: "#2a2016",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f97316",
  },
  moduleActionTextPremium: {
    color: "#fbbf24",
    fontSize: 13,
    fontWeight: "800",
  },
  examCard: {
    backgroundColor: "#1c1a17",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2c2824",
    marginTop: 16,
    marginBottom: 16,
  },
  examTitle: {
    color: "#f5f4f0",
    fontSize: 20,
    fontWeight: "800",
    marginVertical: 6,
  },
  examDesc: {
    color: "#a8a29e",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  examButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  examPrimaryButton: {
    flex: 1,
    backgroundColor: "#f97316",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  examPrimaryButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },
  examSecondaryButton: {
    flex: 1,
    backgroundColor: "#25221e",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#38322c",
  },
  examSecondaryButtonText: {
    color: "#f5f4f0",
    fontSize: 13,
    fontWeight: "700",
  },
  proCtaCard: {
    backgroundColor: "#221a12",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f97316",
    marginTop: 12,
    marginBottom: 24,
  },
  proCtaHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  proCtaBadge: {
    color: "#fbbf24",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  proCtaTitle: {
    color: "#f5f4f0",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
  },
  proCtaDesc: {
    color: "#a8a29e",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  featuresList: {
    marginBottom: 20,
    gap: 8,
  },
  featureItem: {
    color: "#f5f4f0",
    fontSize: 13,
    fontWeight: "600",
  },
  upgradeProButton: {
    backgroundColor: "#f97316",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeProButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  footerText: {
    color: "#78716c",
    fontSize: 11,
    textAlign: "center",
  },
});
