import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { RTCView, mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
import Icon from 'react-native-vector-icons/Ionicons';
import socketServices from '../../../api/WSService';
import styles from './videocallstyle';

const VideoCallScreen = ({ route, navigation }) => {
  const { callData, isCaller } = route.params;
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState(isCaller ? 'calling' : 'incoming');

  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  });

  useEffect(() => {
    const startLocalStream = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    const handleOffer = async (data) => {
      if (data.receiverId === callData.receiverId) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socketServices.emit('webrtc_answer', {
          hash: callData.hash,
          callerId: callData.callerId,
          receiverId: callData.receiverId,
          answer,
        });

        setCallStatus('connected');
      }
    };

    const handleAnswer = async (data) => {
      if (data.callerId === callData.callerId) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        setCallStatus('connected');
      }
    };

    const handleICECandidate = async (data) => {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error('Error adding received ICE candidate:', error);
      }
    };

    const handleCallEnded = () => {
      Alert.alert('Thông báo', 'Cuộc gọi đã kết thúc.');
      navigation.goBack();
    };

    startLocalStream();

    socketServices.on(`webrtc_offer_${callData.hash}`, handleOffer);
    socketServices.on(`webrtc_answer_${callData.hash}`, handleAnswer);
    socketServices.on(`ice_candidate_${callData.hash}`, handleICECandidate);
    socketServices.on(`call_ended_${callData.hash}`, handleCallEnded);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketServices.emit('ice_candidate', {
          hash: callData.hash,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    if (isCaller) {
      const initiateCall = async () => {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socketServices.emit('webrtc_offer', {
          hash: callData.hash,
          callerId: callData.callerId,
          receiverId: callData.receiverId,
          offer,
        });
      };

      initiateCall();
    }

    return () => {
      socketServices.emit('call_ended', {
        hash: callData.hash,
        callerId: callData.callerId,
        receiverId: callData.receiverId,
      });

      peerConnection.close();
      localStream?.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      setRemoteStream(null);

      socketServices.off(`webrtc_offer_${callData.hash}`, handleOffer);
      socketServices.off(`webrtc_answer_${callData.hash}`, handleAnswer);
      socketServices.off(`ice_candidate_${callData.hash}`, handleICECandidate);
      socketServices.off(`call_ended_${callData.hash}`, handleCallEnded);
    };
  }, []);

  const handleAcceptCall = async () => {
    try {
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socketServices.emit('webrtc_answer', {
        hash: callData.hash,
        callerId: callData.callerId,
        receiverId: callData.receiverId,
        answer,
      });

      setCallStatus('connected');
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };

  const handleRejectCall = () => {
    socketServices.emit('call_rejected', {
      hash: callData.hash,
      callerId: callData.callerId,
      receiverId: callData.receiverId,
    });

    navigation.goBack();
  };

  const handleEndCall = () => {
    socketServices.emit('call_ended', {
      hash: callData.hash,
      callerId: callData.callerId,
      receiverId: callData.receiverId,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {localStream && <RTCView streamURL={localStream.toURL()} style={styles.backgroundVideo} />}
      {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} />}

      {callStatus === 'incoming' && (
        <View style={styles.overlay}>
          <Text style={styles.incomingCallText}>Cuộc gọi đến</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.circularButton, styles.acceptButton]} onPress={handleAcceptCall}>
              <Icon name="call" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.circularButton, styles.rejectButton]} onPress={handleRejectCall}>
              <Icon name="call" size={30} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {callStatus === 'connected' && (
        <View style={styles.overlay}>
          <TouchableOpacity style={[styles.circularButton, styles.endCallButton]} onPress={handleEndCall}>
            <Icon name="call" size={30} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>
      )}

      {callStatus === 'calling' && (
        <View style={styles.overlay}>
          <Text style={styles.callingText}>Đang gọi...</Text>
          <TouchableOpacity style={[styles.circularButton, styles.endCallButton]} onPress={handleEndCall}>
            <Icon name="call" size={30} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default VideoCallScreen;
