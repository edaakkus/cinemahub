package com.eda.cinemahub.service;

import com.eda.cinemahub.dto.AuthResponseDto;
import com.eda.cinemahub.dto.LoginRequestDto;
import com.eda.cinemahub.dto.RegisterRequestDto;
import com.eda.cinemahub.dto.UserResponseDto;
import com.eda.cinemahub.entity.Role;
import com.eda.cinemahub.entity.User;
import com.eda.cinemahub.exception.DuplicateUserException;
import com.eda.cinemahub.repository.UserRepository;
import com.eda.cinemahub.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                        JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponseDto register(RegisterRequestDto requestDto) {
        String username = requestDto.getUsername();
        if (userRepository.existsByUsername(username)) {
            throw new DuplicateUserException("Username already taken: " + username);
        }
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new DuplicateUserException("Email already registered: " + requestDto.getEmail());
        }

        User user = new User(
                username,
                requestDto.getEmail(),
                passwordEncoder.encode(requestDto.getPassword()),
                Role.USER
        );

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        UserResponseDto userDto = new UserResponseDto(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        return new AuthResponseDto(token, savedUser.getUsername(), savedUser.getRole().name(), userDto);
    }

    public AuthResponseDto login(LoginRequestDto requestDto) {
        String loginIdentifier = requestDto.getUsername();

        User user = userRepository.findByUsername(loginIdentifier)
                .or(() -> userRepository.findByEmail(loginIdentifier))
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Geçersiz kullanıcı adı veya şifre"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), requestDto.getPassword())
        );

        String token = jwtService.generateToken(user);

        UserResponseDto userDto = new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponseDto(token, user.getUsername(), user.getRole().name(), userDto);
    }

    public UserResponseDto getCurrentUser(String usernameOrEmail) {
        User user = userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + usernameOrEmail));

        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}