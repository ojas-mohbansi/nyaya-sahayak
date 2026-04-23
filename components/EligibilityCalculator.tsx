import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type EligibilityType = "old-age-pension" | "widow-pension";

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string }[];
}

interface EligibilityResult {
  eligible: boolean;
  partial?: boolean;
  title: string;
  message: string;
  amount?: string;
}

const OLD_AGE_QUESTIONS: Question[] = [
  {
    id: "age",
    text: "What is your age?",
    options: [
      { label: "Under 60 years", value: "under60" },
      { label: "60 – 79 years", value: "60to79" },
      { label: "80 years or above", value: "80plus" },
    ],
  },
  {
    id: "bpl",
    text: "Is your family registered as BPL (Below Poverty Line) or is your annual household income below Rs. 3 lakh?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "Not sure", value: "unsure" },
    ],
  },
];

const WIDOW_QUESTIONS: Question[] = [
  {
    id: "widow",
    text: "Are you a widow? (your husband has passed away)",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "age",
    text: "What is your age?",
    options: [
      { label: "Under 40 years", value: "under40" },
      { label: "40 – 79 years", value: "40to79" },
      { label: "80 years or above", value: "80plus" },
    ],
  },
  {
    id: "bpl",
    text: "Does your family hold a BPL (Below Poverty Line) card?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
      { label: "Not sure", value: "unsure" },
    ],
  },
];

function getOldAgeResult(answers: Record<string, string>): EligibilityResult {
  const age = answers["age"];
  const bpl = answers["bpl"];

  if (age === "under60") {
    return {
      eligible: false,
      title: "Not Eligible",
      message:
        "Old Age Pension requires you to be 60 years of age or older. You do not meet the age requirement.",
    };
  }

  if (bpl === "no") {
    return {
      eligible: false,
      title: "Not Eligible",
      message:
        "This pension scheme requires BPL status or an annual income below Rs. 3 lakh. You may not qualify under the central scheme, but check your state's social welfare department as some states have higher income limits.",
    };
  }

  if (bpl === "unsure") {
    return {
      eligible: false,
      partial: true,
      title: "Possibly Eligible",
      message:
        "You meet the age requirement. Visit your nearest Block Development Office (BDO) or Panchayat to check if your family qualifies under BPL or the state income limit. Bring your Aadhaar and income documents.",
    };
  }

  if (age === "80plus") {
    return {
      eligible: true,
      title: "Likely Eligible",
      message:
        "You appear to meet the eligibility criteria for Old Age Pension. Since you are 80+, you qualify for the enhanced pension rate.",
      amount: "Rs. 500/month (central contribution) + state top-up",
    };
  }

  return {
    eligible: true,
    title: "Likely Eligible",
    message:
      "You appear to meet the eligibility criteria for the Indira Gandhi National Old Age Pension Scheme (IGNOAPS). Proceed to apply at your nearest Block Development Office or Common Service Centre.",
    amount: "Rs. 200–2,000/month (varies by state)",
  };
}

function getWidowResult(answers: Record<string, string>): EligibilityResult {
  const widow = answers["widow"];
  const age = answers["age"];
  const bpl = answers["bpl"];

  if (widow === "no") {
    return {
      eligible: false,
      title: "Not Eligible",
      message:
        "This scheme (IGNWPS) is specifically for widows whose husbands have passed away. You do not qualify for this particular pension.",
    };
  }

  if (age === "under40") {
    return {
      eligible: false,
      title: "Not Eligible",
      message:
        "The Indira Gandhi National Widow Pension Scheme requires the applicant to be between 40 and 79 years of age. However, some states provide widow pension to younger beneficiaries — check your state's welfare department.",
    };
  }

  if (bpl === "no") {
    return {
      eligible: false,
      title: "Not Eligible",
      message:
        "This pension scheme is targeted at BPL (Below Poverty Line) families. You may not qualify under the central scheme, but some states have their own widow pension schemes without strict BPL requirements.",
    };
  }

  if (bpl === "unsure") {
    return {
      eligible: false,
      partial: true,
      title: "Possibly Eligible",
      message:
        "You meet the widow status and age requirements. Visit your nearest District Social Welfare Office or Panchayat to check BPL eligibility and apply. Carry your husband's death certificate and Aadhaar.",
    };
  }

  if (age === "80plus") {
    return {
      eligible: true,
      title: "Likely Eligible",
      message:
        "You appear to meet all eligibility criteria for widow pension. Since you are 80+, you qualify for the enhanced pension rate.",
      amount: "Rs. 500/month",
    };
  }

  return {
    eligible: true,
    title: "Likely Eligible",
    message:
      "You appear to meet all eligibility criteria for the Indira Gandhi National Widow Pension Scheme (IGNWPS). Apply at your nearest District Social Welfare Office or Gram Panchayat.",
    amount: "Rs. 300/month",
  };
}

function computeResult(type: EligibilityType, answers: Record<string, string>): EligibilityResult {
  if (type === "old-age-pension") return getOldAgeResult(answers);
  return getWidowResult(answers);
}

interface EligibilityCalculatorProps {
  type: EligibilityType;
  accentColor: string;
}

export function EligibilityCalculator({ type, accentColor }: EligibilityCalculatorProps) {
  const colors = useColors();
  const questions = type === "old-age-pension" ? OLD_AGE_QUESTIONS : WIDOW_QUESTIONS;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQ + 1 < questions.length) {
      setCurrentQ((q) => q + 1);
    } else {
      const res = computeResult(type, newAnswers);
      setResult(res);
    }
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAnswers({});
    setCurrentQ(0);
    setResult(null);
  };

  const resultColor = result?.eligible
    ? colors.success
    : result?.partial
      ? colors.warn
      : colors.destructive;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <Pressable
        onPress={() => {
          setExpanded((v) => !v);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        style={styles.header}
      >
        <View style={[styles.headerIcon, { backgroundColor: accentColor + "20" }]}>
          <Feather name="check-circle" size={18} color={accentColor} />
        </View>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Eligibility Calculator
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {result
              ? result.title
              : expanded
                ? `Question ${Math.min(currentQ + 1, questions.length)} of ${questions.length}`
                : "Check if you qualify"}
          </Text>
        </View>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.mutedForeground}
        />
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {result ? (
            <View style={styles.resultWrap}>
              <View
                style={[
                  styles.resultBanner,
                  { backgroundColor: resultColor + "15", borderColor: resultColor + "40" },
                ]}
              >
                <Feather
                  name={
                    result.eligible ? "check-circle" : result.partial ? "alert-circle" : "x-circle"
                  }
                  size={22}
                  color={resultColor}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.resultTitle, { color: resultColor }]}>{result.title}</Text>
                  {result.amount && (
                    <Text style={[styles.resultAmount, { color: resultColor }]}>
                      {result.amount}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={[styles.resultMessage, { color: colors.foreground }]}>
                {result.message}
              </Text>
              <Pressable
                onPress={handleReset}
                style={({ pressed }) => [
                  styles.resetBtn,
                  {
                    backgroundColor: colors.secondary,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Feather name="refresh-ccw" size={14} color={colors.mutedForeground} />
                <Text style={[styles.resetBtnText, { color: colors.mutedForeground }]}>
                  Re-check Eligibility
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.questionWrap}>
              <View style={styles.progressDots}>
                {questions.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          idx < currentQ
                            ? accentColor
                            : idx === currentQ
                              ? accentColor + "60"
                              : colors.border,
                      },
                    ]}
                  />
                ))}
              </View>

              <Text style={[styles.questionText, { color: colors.foreground }]}>
                {questions[currentQ].text}
              </Text>

              <View style={styles.optionsWrap}>
                {questions[currentQ].options.map((opt) => (
                  <Pressable
                    key={opt.value}
                    onPress={() => handleAnswer(questions[currentQ].id, opt.value)}
                    style={({ pressed }) => [
                      styles.optionBtn,
                      {
                        backgroundColor: pressed ? accentColor + "15" : colors.background,
                        borderColor: pressed ? accentColor : colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.optionText, { color: colors.foreground }]}>
                      {opt.label}
                    </Text>
                    <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                  </Pressable>
                ))}
              </View>

              {currentQ > 0 && (
                <Pressable
                  onPress={() => {
                    setCurrentQ((q) => q - 1);
                    const prev = { ...answers };
                    delete prev[questions[currentQ - 1].id];
                    setAnswers(prev);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={styles.backBtn}
                >
                  <Feather name="arrow-left" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.backBtnText, { color: colors.mutedForeground }]}>Back</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextWrap: { flex: 1 },
  headerTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: 0,
  },
  body: {
    gap: 0,
  },
  questionWrap: {
    padding: 16,
    gap: 14,
  },
  progressDots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  questionText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 22,
  },
  optionsWrap: {
    gap: 8,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  optionText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  backBtnText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  resultWrap: {
    padding: 16,
    gap: 12,
  },
  resultBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  resultAmount: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginTop: 2,
  },
  resultMessage: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
  },
  resetBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
