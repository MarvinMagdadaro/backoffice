package com.trimark.backoffice.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import com.trimark.backoffice.service.UserDetailsService;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class JWTTokenAuthFilter extends OncePerRequestFilter {
    private static List<Pattern> AUTH_ROUTES = new ArrayList<>();
    private static List<String> NO_AUTH_ROUTES = new ArrayList<>();
    public static final String JWT_KEY = "JWT-TOKEN-SECRET";

    static {
        AUTH_ROUTES.add(Pattern.compile("/api/*"));
        NO_AUTH_ROUTES.add("/api/user/authenticate");
        NO_AUTH_ROUTES.add("/api/user/register");
    }

    private Logger LOG = LoggerFactory.getLogger(JWTTokenAuthFilter.class);

    @Autowired
    private UserDetailsService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authorizationHeader = request.getHeader("authorization");
        String authenticationHeader = request.getHeader("authentication");
        String route = request.getRequestURI();
        // no auth route matching
        boolean needsAuthentication = false;

        //LOG.info("request.getRequestURI(): " + request.getRequestURI());

        for (Pattern p : AUTH_ROUTES) {
            if (p.matcher(route).matches()) {
                needsAuthentication = true;
                break;
            }
        }

        if(route.startsWith("/api/")) {
            needsAuthentication = true;
        }

        if (NO_AUTH_ROUTES.contains(route)) {
            needsAuthentication = false;
        }

        // Checking whether the current route needs to be authenticated
        if (needsAuthentication) {
            // Check for authorization header presence
            String authHeader = null;
            if (authorizationHeader == null || authorizationHeader.equalsIgnoreCase("")) {
                if (authenticationHeader == null || authenticationHeader.equalsIgnoreCase("")) {
                    authHeader = null;
                } else {
                    authHeader = authenticationHeader;
                }
            } else {
                authHeader = authorizationHeader;
            }

            if (StringUtils.isBlank(authHeader) || !authHeader.startsWith("Bearer ")) {
                throw new AuthCredentialsMissingException("Missing or invalid Authorization header.");
            }

            final String token = authHeader.substring(7); // The part after "Bearer "
            try {
                final Claims claims = Jwts.parser().setSigningKey(JWT_KEY)
                        .parseClaimsJws(token).getBody();
                request.setAttribute("claims", claims);

                /**authenticate start**/
                /*
    			UserDetails userDetails = this.userService.loadUserByUsername(SecurityContextHolder.getContext().getAuthentication().getDetails());
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
				SecurityContextHolder.getContext().setAuthentication(authentication);
				*/
                /**authenticate end**/

                // Now since the authentication process if finished
                // move the request forward
                filterChain.doFilter(request, response);
            } catch (final Exception e) {
                throw new AuthenticationFailedException("Invalid token. Cause:"+e.getMessage());
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }
}
