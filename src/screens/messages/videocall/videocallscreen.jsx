import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { RTCView, mediaDevices, RTCPeerConnection } from 'react-native-webrtc';
import socketServices from '../../../api/WSService';
import { getUserInfoApi } from '../../../api/profileapi'; 
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './videocallstyle';

const VideoCallScreen = ({ route, navigation }) => {
  const { callData, isCaller } = route.params;
  console.log('calldata', callData);
  const [callerInfo, setCallerInfo] = useState(null); 
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState(isCaller ? 'calling' : 'incoming');

  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  useEffect(() => {
    const startLocalStream = async () => {
      const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
    };

    const fetchCallerInfo = async () => {
      try {
        const response = await getUserInfoApi(callData.callerId); // Gọi API với callerId
        if (response?.code === 1000 && response?.result) {
          setCallerInfo(response.result); // Lưu thông tin người gọi vào state
        } else {
          console.warn('Không tìm thấy thông tin người gọi.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người gọi:', error);
      }
    };  

    const handleIncomingCall = (data) => {
      setCallStatus('incoming');
    };

    const handleCallAccepted = async (data) => {
      setCallStatus('connected');
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socketServices.emit('answer', { answer });
    };

    const handleIceCandidate = async (candidate) => {
      if (candidate) {
        await peerConnection.addIceCandidate(candidate);
      }
    };

    startLocalStream();

    socketServices.on('incoming_call', handleIncomingCall);
    socketServices.on('call_accepted', handleCallAccepted);
    socketServices.on('ice-candidate', handleIceCandidate);

    peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketServices.emit('ice-candidate', event.candidate);
      }
    };

    if (isCaller) {
      initiateCall();
    }

    return () => {
      socketServices.off('incoming_call', handleIncomingCall);
      socketServices.off('call_accepted', handleCallAccepted);
      socketServices.off('ice-candidate', handleIceCandidate);
      peerConnection.close();
    };
  }, []);

  const initiateCall = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socketServices.emit('call', { offer, ...callData });
  };

  const handleAcceptCall = async () => {
    setCallStatus('connected');
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socketServices.emit('call_accepted', {
      callerId: callData.callerId,
      receiverId: callData.receiverId,
      answer,
    });
  };

  const handleRejectCall = () => {
    setCallStatus('rejected');
    socketServices.emit('call_rejected', {
      callerId: callData.callerId,
      receiverId: callData.receiverId,
    });
    navigation.goBack();
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    peerConnection.close();
    socketServices.emit('call_ended', {
      callerId: callData.callerId,
      receiverId: callData.receiverId,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {callStatus === 'incoming' && (
        <View style={styles.incomingCallContainer}>
          <Image
            source={
              callerInfo?.avatar_path && callerInfo.avatar_path.startsWith('http')
                ? { uri: callerInfo.avatar_path }
                : require('../../../../assets/image/avatar_icon.png')
            }
            style={styles.avatar}
          />
          <Text style={styles.incomingCallText}>{`Cuộc gọi đến từ ${callerInfo?.username || 'Người dùng'}`}</Text>
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
        <View style={styles.videoContainer}>
          <RTCView streamURL={localStream && localStream.toURL()} style={styles.localVideo} />
          <RTCView streamURL={remoteStream && remoteStream.toURL()} style={styles.remoteVideo} />
          <TouchableOpacity style={[styles.circularButton, styles.endCallButton]} onPress={handleEndCall}>
            <Icon name="call" size={30} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>
      )}

      {callStatus === 'calling' && (
        <View style={styles.callingContainer}>
          <Image
            source={
              callData.avatarPath && callData.avatarPath.startsWith('http')
                ? { uri: callData.avatarPath }
                : require('../../../../assets/image/avatar_icon.png')
            }
            style={styles.avatar}
          />
          <Text style={styles.callingText}>{`Đang gọi ${callData.callerName}...`}</Text>
          <TouchableOpacity style={[styles.circularButton, styles.endCallButton]} onPress={handleEndCall}>
            <Icon name="call" size={30} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>
      )}

      {callStatus === 'rejected' && (
        <Text style={styles.rejectedText}>Cuộc gọi bị từ chối</Text>
      )}
    </View>
  );
};

export default VideoCallScreen;
