    package com.example.together.configuration;

    import org.springframework.context.annotation.Configuration;
    import org.springframework.messaging.simp.config.ChannelRegistration;
    import org.springframework.messaging.simp.config.MessageBrokerRegistry;
    import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
    import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
    import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

    @Configuration
    @EnableWebSocketMessageBroker
    public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
        @Override
        public void registerStompEndpoints(StompEndpointRegistry registry) {
            //đăng ký endpoint để client kết nối và sử dụng giao thức STOMP
            registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
        }

        @Override
        public void configureMessageBroker(MessageBrokerRegistry registry) {
            //Các tin nhắn có địa chỉ bắt đầu bằng app được xử lý bởi các phương thức có annotation @messageMapping
            registry.setApplicationDestinationPrefixes("/app");
            // Kích hoạt Broker với các điểm đến cho tin nhắn nhóm  và tin nhắn cá nhân
            registry.enableSimpleBroker("/topic","/user","/post");
            // Thiết lập tiền tố để xử lý các tin nhắn riêng cho từng người dùng.
            registry.setUserDestinationPrefix("/user");
        }
    }
