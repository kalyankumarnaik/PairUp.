import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function MobileSafetyScreen() {
  // Date Guard state
  const [partnerName, setPartnerName] = useState('Ananya');
  const [venue, setVenue] = useState('Third Wave Coffee, Indiranagar');
  const [emergencyContact, setEmergencyContact] = useState('+91 98765 43210 (Priya - Best Friend)');
  const [selectedMins, setSelectedMins] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30 * 60);

  // Modals
  const [showCheckInAlert, setShowCheckInAlert] = useState(false);
  const [showFakeCall, setShowFakeCall] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);

  // Safety Preferences
  const [locationMasking, setLocationMasking] = useState(true);
  const [incognitoBrowsing, setIncognitoBrowsing] = useState(false);
  const [strictAdultShield, setStrictAdultShield] = useState(true);
  const [mediaBlur, setMediaBlur] = useState(true);

  // Date Readiness Checklist
  const [checklist, setChecklist] = useState({
    publicVenue: true,
    shareWithFriend: true,
    ownTransport: false,
    phoneCharged: true
  });

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            setShowCheckInAlert(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const startTimer = () => {
    setSecondsRemaining(selectedMins * 60);
    setIsTimerRunning(true);
    Alert.alert('Date Safety Guard Activated 🛡️', `Timer set for ${selectedMins} minutes. Stay safe and enjoy your meetup.`);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(selectedMins * 60);
    Alert.alert('Date Guard Concluded', 'Date ended safely. Timer deactivated.');
  };

  const extendTimer = (mins: number) => {
    setSecondsRemaining((prev) => prev + mins * 60);
    setIsTimerRunning(true);
    setShowCheckInAlert(false);
    Alert.alert('Check-In Confirmed', `Extended timer by +${mins} minutes.`);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const dialHelpline = (num: string) => {
    Linking.openURL(`tel:${num}`).catch(() => {
      Alert.alert('Calling Failed', `Please dial ${num} directly from your phone app.`);
    });
  };

  const sosMessage = `SOS ALERT: I am on a date with ${partnerName} at ${venue}. I triggered an emergency distress alert on PairUp. Please check on me or contact 112 immediately.`;

  const sendSosSms = () => {
    const cleanNum = emergencyContact.split(' ')[0];
    Linking.openURL(`sms:${cleanNum}?body=${encodeURIComponent(sosMessage)}`).catch(() => {
      Alert.alert('SMS Dispatch', 'Unable to open default SMS app.');
    });
  };

  const checklistCount = Object.values(checklist).filter(Boolean).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.badgeRow}>
            <View style={styles.shieldDot} />
            <Text style={styles.badgeText}>COMMUNITY TRUST & SAFETY</Text>
          </View>
          <Text style={styles.headerTitle}>PairUp Safety Center</Text>
        </View>

        <TouchableOpacity
          style={styles.sosQuickBtn}
          onPress={() => setShowSosModal(true)}
        >
          <Text style={styles.sosQuickBtnText}>🚨 SOS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ================================================================= */}
        {/* DATE SAFETY GUARD TIMER CARD */}
        {/* ================================================================= */}
        <View style={styles.dateGuardCard}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.guardBadge}>🛡️ LIVE DATE SAFETY GUARD</Text>
              <Text style={styles.guardTitle}>In-Person Meetup Timer</Text>
            </View>
            <TouchableOpacity
              style={styles.sosButton}
              onPress={() => setShowSosModal(true)}
            >
              <Text style={styles.sosButtonText}>SOS</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.guardSubtitle}>
            Going on a date? Set a check-in reminder. If you don't confirm you're safe, PairUp alerts your guardian.
          </Text>

          {/* Configuration Inputs */}
          <View style={styles.inputsGroup}>
            <View style={styles.inputItem}>
              <Text style={styles.inputLabel}>WHO ARE YOU MEETING?</Text>
              <TextInput
                style={styles.textInput}
                value={partnerName}
                onChangeText={setPartnerName}
                editable={!isTimerRunning}
                placeholder="Partner Name"
                placeholderTextColor="#A39EB8"
              />
            </View>

            <View style={styles.inputItem}>
              <Text style={styles.inputLabel}>MEETING VENUE / LOCATION</Text>
              <TextInput
                style={styles.textInput}
                value={venue}
                onChangeText={setVenue}
                editable={!isTimerRunning}
                placeholder="Cafe / Restaurant"
                placeholderTextColor="#A39EB8"
              />
            </View>

            <View style={styles.inputItem}>
              <Text style={styles.inputLabel}>GUARDIAN EMERGENCY CONTACT</Text>
              <TextInput
                style={styles.textInput}
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                editable={!isTimerRunning}
                placeholder="Emergency Contact Phone"
                placeholderTextColor="#A39EB8"
              />
            </View>

            {/* Duration presets */}
            <View style={styles.durationRow}>
              <Text style={styles.inputLabel}>INTERVAL:</Text>
              {[15, 30, 45, 60, 90].map((m) => (
                <TouchableOpacity
                  key={m}
                  disabled={isTimerRunning}
                  style={[styles.durChip, selectedMins === m && styles.durChipActive]}
                  onPress={() => {
                    setSelectedMins(m);
                    setSecondsRemaining(m * 60);
                  }}
                >
                  <Text style={[styles.durChipText, selectedMins === m && styles.durChipTextActive]}>
                    {m}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Clock Display */}
          <View style={styles.clockContainer}>
            <View style={[styles.clockRing, isTimerRunning && styles.clockRingActive]}>
              <Text style={styles.clockTime}>{formatTimer(secondsRemaining)}</Text>
              <Text style={styles.clockStatus}>
                {isTimerRunning ? 'Active Date Guard' : 'Ready to Start'}
              </Text>
            </View>

            {/* Timer Actions */}
            <View style={styles.timerActionsRow}>
              {isTimerRunning ? (
                <>
                  <TouchableOpacity
                    style={[styles.timerBtn, { backgroundColor: '#16845B' }]}
                    onPress={() => extendTimer(30)}
                  >
                    <Text style={styles.timerBtnText}>+30m Extend</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.timerBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                    onPress={stopTimer}
                  >
                    <Text style={styles.timerBtnText}>Conclude Safe</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.startTimerBtn} onPress={startTimer}>
                  <Text style={styles.startTimerBtnText}>▶ Activate Date Guard</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity onPress={() => setShowCheckInAlert(true)}>
              <Text style={styles.testAlertText}>Test Check-In Reminder Alert 🔔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================================================================= */}
        {/* PRIVACY & SAFETY SHIELDS TOGGLES */}
        {/* ================================================================= */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Privacy & Discovery Shield</Text>
          <Text style={styles.sectionSubtitle}>
            Real-time toggles to control how your location and identity appear.
          </Text>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.toggleTitle}>🔒 Location Masking</Text>
              <Text style={styles.toggleDesc}>
                Generalize distance to ~3–5km zone. Raw GPS is never shared.
              </Text>
            </View>
            <Switch
              value={locationMasking}
              onValueChange={setLocationMasking}
              trackColor={{ false: '#E8E7EF', true: '#7C3AED' }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.toggleTitle}>🕵️ Incognito Browsing</Text>
              <Text style={styles.toggleDesc}>
                Browse profiles without appearing in recently viewed radars.
              </Text>
            </View>
            <Switch
              value={incognitoBrowsing}
              onValueChange={setIncognitoBrowsing}
              trackColor={{ false: '#E8E7EF', true: '#7C3AED' }}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.toggleTitle}>🔞 Strict 18+ Adult Shield</Text>
              <Text style={styles.toggleDesc}>
                Filter out unverified accounts. Adult age screening mandatory.
              </Text>
            </View>
            <Switch
              value={strictAdultShield}
              onValueChange={setStrictAdultShield}
              trackColor={{ false: '#E8E7EF', true: '#16845B' }}
            />
          </View>

          <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.toggleTitle}>🛡️ Chat Photo Safety Blur</Text>
              <Text style={styles.toggleDesc}>
                Automatically blur images in chats until you tap to view them.
              </Text>
            </View>
            <Switch
              value={mediaBlur}
              onValueChange={setMediaBlur}
              trackColor={{ false: '#E8E7EF', true: '#FF4F81' }}
            />
          </View>
        </View>

        {/* ================================================================= */}
        {/* DATE SAFETY CHECKLIST */}
        {/* ================================================================= */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Pre-Date Safety Checklist</Text>
            <Text style={styles.checklistBadge}>{checklistCount} / 4 Ready</Text>
          </View>

          <TouchableOpacity
            style={styles.checkItem}
            onPress={() => setChecklist({ ...checklist, publicVenue: !checklist.publicVenue })}
          >
            <Text style={{ fontSize: 18, marginRight: 10 }}>
              {checklist.publicVenue ? '✅' : '⬜'}
            </Text>
            <Text style={styles.checkItemText}>Meeting in a public, well-lit cafe or restaurant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkItem}
            onPress={() => setChecklist({ ...checklist, shareWithFriend: !checklist.shareWithFriend })}
          >
            <Text style={{ fontSize: 18, marginRight: 10 }}>
              {checklist.shareWithFriend ? '✅' : '⬜'}
            </Text>
            <Text style={styles.checkItemText}>Informed a trusted friend of your meeting spot</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkItem}
            onPress={() => setChecklist({ ...checklist, ownTransport: !checklist.ownTransport })}
          >
            <Text style={{ fontSize: 18, marginRight: 10 }}>
              {checklist.ownTransport ? '✅' : '⬜'}
            </Text>
            <Text style={styles.checkItemText}>Arranged own ride/transportation to and from venue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkItem}
            onPress={() => setChecklist({ ...checklist, phoneCharged: !checklist.phoneCharged })}
          >
            <Text style={{ fontSize: 18, marginRight: 10 }}>
              {checklist.phoneCharged ? '✅' : '⬜'}
            </Text>
            <Text style={styles.checkItemText}>Phone charged & emergency contacts saved</Text>
          </TouchableOpacity>
        </View>

        {/* ================================================================= */}
        {/* 24x7 EMERGENCY HELPLINES (INDIA) */}
        {/* ================================================================= */}
        <View style={styles.helplinesCard}>
          <Text style={styles.helplinesTitle}>Direct Dial Emergency Helplines (India 24x7)</Text>
          <Text style={styles.helplinesSubtitle}>
            Tap to initiate immediate phone call to national authorities:
          </Text>

          <View style={styles.helplineGrid}>
            <TouchableOpacity style={styles.helplineBtn} onPress={() => dialHelpline('112')}>
              <Text style={styles.helplineLabel}>National Police / SOS</Text>
              <Text style={styles.helplineNumber}>112 ↗</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.helplineBtn, { borderColor: '#FF4F81' }]}
              onPress={() => dialHelpline('1091')}
            >
              <Text style={[styles.helplineLabel, { color: '#FF4F81' }]}>Women Helpline</Text>
              <Text style={[styles.helplineNumber, { color: '#FF4F81' }]}>1091 ↗</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineBtn} onPress={() => dialHelpline('1930')}>
              <Text style={styles.helplineLabel}>Cyber Fraud Helpline</Text>
              <Text style={styles.helplineNumber}>1930 ↗</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helplineBtn} onPress={() => dialHelpline('108')}>
              <Text style={styles.helplineLabel}>Medical Emergency</Text>
              <Text style={styles.helplineNumber}>108 ↗</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ================================================================= */}
      {/* MODAL: CHECK-IN REMINDER ALERT */}
      {/* ================================================================= */}
      <Modal visible={showCheckInAlert} animationType="fade" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.alertCard}>
            <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: 8 }}>🔔</Text>
            <Text style={styles.alertTitle}>PairUp Safety Check-In</Text>
            <Text style={styles.alertDesc}>
              Your check-in timer for your date with {partnerName} at {venue} just ended. Are you comfortable?
            </Text>

            <TouchableOpacity
              style={styles.alertExtendBtn}
              onPress={() => extendTimer(45)}
            >
              <Text style={styles.alertExtendText}>✅ I'm Safe & Having Fun (+45m)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.alertFakeCallBtn}
              onPress={() => {
                setShowCheckInAlert(false);
                setShowFakeCall(true);
              }}
            >
              <Text style={styles.alertFakeCallText}>📞 Trigger Fake Excuse Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.alertSosBtn}
              onPress={() => {
                setShowCheckInAlert(false);
                setShowSosModal(true);
              }}
            >
              <Text style={styles.alertSosText}>🚨 I Feel Unsafe • TRIGGER SOS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================================================================= */}
      {/* MODAL: FAKE EXCUSE CALL */}
      {/* ================================================================= */}
      <Modal visible={showFakeCall} animationType="slide" transparent>
        <View style={styles.fakeCallBackdrop}>
          <View style={styles.fakeCallCard}>
            <View style={styles.fakeCallIconWrap}>
              <Text style={{ fontSize: 36 }}>📞</Text>
            </View>
            <Text style={styles.fakeCallTitle}>Incoming Call...</Text>
            <Text style={styles.fakeCallCaller}>Mom / Work Emergency</Text>
            <Text style={styles.fakeCallNote}>
              "Hey, I need you home right now!" Use this screen as a polite, immediate excuse to leave safely.
            </Text>

            <TouchableOpacity
              style={styles.fakeCallDismissBtn}
              onPress={() => setShowFakeCall(false)}
            >
              <Text style={styles.fakeCallDismissText}>Dismiss Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================================================================= */}
      {/* MODAL: EMERGENCY SOS PROTOCOL */}
      {/* ================================================================= */}
      <Modal visible={showSosModal} animationType="slide" transparent>
        <View style={styles.sosModalBackdrop}>
          <View style={styles.sosCard}>
            <Text style={styles.sosHeading}>🚨 EMERGENCY SOS ACTIVE</Text>
            <Text style={styles.sosDesc}>
              If you are in immediate threat, call national police lines directly:
            </Text>

            <View style={styles.sosDialsRow}>
              <TouchableOpacity
                style={[styles.sosDialBtn, { backgroundColor: '#E11D48' }]}
                onPress={() => dialHelpline('112')}
              >
                <Text style={styles.sosDialText}>Call 112 (Police)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sosDialBtn, { backgroundColor: '#FF4F81' }]}
                onPress={() => dialHelpline('1091')}
              >
                <Text style={styles.sosDialText}>Call 1091 (Women)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sosMessageBox}>
              <Text style={styles.sosMessageTitle}>Pre-Filled SMS to {emergencyContact}:</Text>
              <Text style={styles.sosMessageBody}>"{sosMessage}"</Text>

              <TouchableOpacity style={styles.openSmsBtn} onPress={sendSosSms}>
                <Text style={styles.openSmsBtnText}>Open SMS App & Send Alert ➔</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeSosBtn}
              onPress={() => setShowSosModal(false)}
            >
              <Text style={styles.closeSosText}>Close SOS Window</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E7EF'
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  shieldDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16845B'
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16845B',
    letterSpacing: 0.5
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#242039',
    marginTop: 2
  },
  sosQuickBtn: {
    backgroundColor: '#FFEBEF',
    borderWidth: 1,
    borderColor: '#FFD1DF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14
  },
  sosQuickBtnText: {
    color: '#E11D48',
    fontSize: 12,
    fontWeight: '900'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  dateGuardCard: {
    backgroundColor: '#242039',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  guardBadge: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FF4F81',
    letterSpacing: 0.5
  },
  guardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2
  },
  guardSubtitle: {
    fontSize: 11,
    color: '#A39EB8',
    marginTop: 6,
    lineHeight: 16
  },
  sosButton: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900'
  },
  inputsGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 14,
    marginTop: 14,
    gap: 10
  },
  inputItem: {
    gap: 4
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4
  },
  durChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10
  },
  durChipActive: {
    backgroundColor: '#FF4F81'
  },
  durChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  durChipTextActive: {
    fontWeight: '900'
  },
  clockContainer: {
    alignItems: 'center',
    marginTop: 18
  },
  clockRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  clockRingActive: {
    borderColor: '#FF4F81'
  },
  clockTime: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1
  },
  clockStatus: {
    fontSize: 10,
    color: '#A39EB8',
    fontWeight: '700',
    marginTop: 4
  },
  timerActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    width: '100%',
    justifyContent: 'center'
  },
  timerBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center'
  },
  timerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  startTimerBtn: {
    backgroundColor: '#FF4F81',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center'
  },
  startTimerBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900'
  },
  testAlertText: {
    color: '#FF8A5B',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 12,
    textDecorationLine: 'underline'
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E7EF'
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#242039'
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#6B6684',
    marginTop: 2,
    marginBottom: 12
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6'
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#242039'
  },
  toggleDesc: {
    fontSize: 11,
    color: '#6B6684',
    marginTop: 2
  },
  checklistBadge: {
    fontSize: 11,
    fontWeight: '900',
    color: '#16845B',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6'
  },
  checkItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#242039',
    flex: 1
  },
  helplinesCard: {
    backgroundColor: '#242039',
    borderRadius: 22,
    padding: 16
  },
  helplinesTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  helplinesSubtitle: {
    fontSize: 11,
    color: '#A39EB8',
    marginTop: 2,
    marginBottom: 12
  },
  helplineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  helplineBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 10,
    width: (width - 32 - 32 - 8) / 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  helplineLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700'
  },
  helplineNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF8A5B',
    marginTop: 2
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  alertCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#242039',
    textAlign: 'center'
  },
  alertDesc: {
    fontSize: 12,
    color: '#6B6684',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18
  },
  alertExtendBtn: {
    backgroundColor: '#16845B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 18
  },
  alertExtendText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  alertFakeCallBtn: {
    backgroundColor: '#F0EAFD',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8
  },
  alertFakeCallText: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '800'
  },
  alertSosBtn: {
    backgroundColor: '#E11D48',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8
  },
  alertSosText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900'
  },
  fakeCallBackdrop: {
    flex: 1,
    backgroundColor: '#242039',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  fakeCallCard: {
    alignItems: 'center',
    width: '100%'
  },
  fakeCallIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF4F81',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  fakeCallTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  fakeCallCaller: {
    fontSize: 14,
    color: '#FF8A5B',
    fontWeight: '700',
    marginTop: 4
  },
  fakeCallNote: {
    fontSize: 12,
    color: '#A39EB8',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
    paddingHorizontal: 20
  },
  fakeCallDismissBtn: {
    backgroundColor: '#E11D48',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 18,
    marginTop: 36
  },
  fakeCallDismissText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900'
  },
  sosModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(36, 32, 57, 0.95)',
    justifyContent: 'center',
    padding: 20
  },
  sosCard: {
    backgroundColor: '#242039',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E11D48'
  },
  sosHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#E11D48'
  },
  sosDesc: {
    fontSize: 11,
    color: '#FFFFFF',
    marginTop: 6
  },
  sosDialsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14
  },
  sosDialBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center'
  },
  sosDialText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900'
  },
  sosMessageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 12,
    marginTop: 16
  },
  sosMessageTitle: {
    fontSize: 10,
    color: '#FF8A5B',
    fontWeight: '800'
  },
  sosMessageBody: {
    fontSize: 11,
    color: '#FFFFFF',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 16
  },
  openSmsBtn: {
    backgroundColor: '#FF4F81',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },
  openSmsBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  closeSosBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12
  },
  closeSosText: {
    color: '#A39EB8',
    fontSize: 12,
    fontWeight: '700'
  }
});
