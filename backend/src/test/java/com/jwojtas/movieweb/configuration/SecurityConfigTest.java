package com.jwojtas.movieweb.configuration;

import com.jwojtas.movieweb.configurations.SecurityConfig;
import com.jwojtas.movieweb.tokens.JwtAuthenticationFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest
@Import(SecurityConfigTest.TestConfig.class)
public class SecurityConfigTest {

    @Configuration
    @Import(SecurityConfig.class)
    static class TestConfig {

        @Bean
        public JwtAuthenticationFilter jwtAuthenticationFilter() {
            return new JwtAuthenticationFilter(null, null, null) {
                @Override
                protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws jakarta.servlet.ServletException, java.io.IOException {
                    String uri = request.getRequestURI();

                    if (uri.startsWith("/api/auth")) {
                        filterChain.doFilter(request, response);
                    } else if (uri.startsWith("/movies")) {
                        SecurityContextHolder.getContext().setAuthentication(
                                new UsernamePasswordAuthenticationToken(
                                        "admin", null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                                )
                        );
                        filterChain.doFilter(request, response);
                    } else if (uri.startsWith("/admin")) {
                        SecurityContextHolder.getContext().setAuthentication(
                                new UsernamePasswordAuthenticationToken(
                                        "user", null, List.of(new SimpleGrantedAuthority("ROLE_USER"))
                                )
                        );
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    } else {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    }
                }
            };
        }

        @Bean
        public UserDetailsService userDetailsService() {
            return Mockito.mock(UserDetailsService.class);
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void shouldDenyUserToAccessAdminEndpoints() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "user", null, List.of(new SimpleGrantedAuthority("ROLE_USER"))
                )
        );

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isForbidden());
    }
}
