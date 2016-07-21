package com.trimark.backoffice.model.entity;


import javax.persistence.Access;
import javax.persistence.AccessType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.security.core.GrantedAuthority;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.trimark.backoffice.framework.data.JPAEntity;

@Entity
@Table(name="permissions")
@Access(AccessType.FIELD)
@JsonIdentityInfo(generator=ObjectIdGenerators.PropertyGenerator.class, property="id")
public class Permission extends JPAEntity<Long> implements GrantedAuthority {

    @NotNull(message = "{error.permission.permissionname.null}")
    @NotEmpty(message = "{error.permission.permissionname.empty}")
    @Size(max = 50, message = "{permission.permissionname.role.max}")
    @Column(name = "permissionname", length = 50)
    private String permissionname;
/*    
    @OneToMany(fetch = FetchType.EAGER)  
    @JoinTable(name = "role_permissions",   
        joinColumns        = {@JoinColumn(name = "permission_id", referencedColumnName = "id")},  
        inverseJoinColumns = {@JoinColumn(name = "role_id", referencedColumnName = "id")}  
    )  
    private List<Role> permRoles;
*/
    
    public String getPermissionname() {
        return permissionname;
    }

    public void setPermissionname(String permissionname) {
        this.permissionname = permissionname;
    }
/*
    public List<Role> getPermRoles() {
        return permRoles;
    }

    public void setPermRoles(List<Role> permRoles) {
        this.permRoles = permRoles;
    }
*/
    @Override
    public String toString() {
        return String.format("%s(id=%d, permissionname='%s')", 
                this.getClass().getSimpleName(), 
                this.getId(), this.getPermissionname());
    }

	@Override
	public String getAuthority() {
		return permissionname;
	}

}
