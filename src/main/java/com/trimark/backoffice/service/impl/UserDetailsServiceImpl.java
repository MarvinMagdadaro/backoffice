package com.trimark.backoffice.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trimark.backoffice.framework.exception.EmailNotFoundException;
import com.trimark.backoffice.model.entity.Permission;
import com.trimark.backoffice.model.entity.Role;
import com.trimark.backoffice.model.entity.User;
import com.trimark.backoffice.model.repository.UserRepository;
import com.trimark.backoffice.service.UserDetailsService;

import java.util.*;

@Service
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService {
    private @Autowired UserRepository userRepository;

    @Override
    @Transactional(readOnly=true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return loadUserByEmail(username);
    }

    private UserDetails loadUserByEmail(final String email)
            throws EmailNotFoundException {

        User user = userRepository.findByEmail(email);
        List<GrantedAuthority> authorities =
                buildUserAuthority(user.getRole());

        return buildUserForAuthentication(user, authorities);

/*
        return new UserDetails() {
            @Override
            public Collection<? extends GrantedAuthority> getAuthorities() {
                return null;
            }

            @Override
            public String getPassword() {
                return null;
            }

            @Override
            public String getUsername() {
                return null;
            }

            @Override
            public boolean isAccountNonExpired() {
                return false;
            }

            @Override
            public boolean isAccountNonLocked() {
                return false;
            }

            @Override
            public boolean isCredentialsNonExpired() {
                return false;
            }

            @Override
            public boolean isEnabled() {
                return false;
            }
        };
*/        
    }

    // Converts com.trimark.backoffice.model.entity..User user to org.springframework.security.core.userdetails.User
    private org.springframework.security.core.userdetails.User buildUserForAuthentication(User user,
                                                                                          List<GrantedAuthority> authorities) {

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
                user.isEnabled(), true, true, true, authorities);
    }

    private List<GrantedAuthority> buildUserAuthority(Role role) {
        List<GrantedAuthority> Result = new ArrayList<>();
        Result.add(new SimpleGrantedAuthority(role.getRolename()));
        for (Permission permission : role.getPermissions()) {
            Result.add(new SimpleGrantedAuthority(permission.getPermissionname()));
        }
        return Result;
    }
}
