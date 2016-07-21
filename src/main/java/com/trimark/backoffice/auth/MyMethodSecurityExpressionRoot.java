package com.trimark.backoffice.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.core.Authentication;

public class MyMethodSecurityExpressionRoot extends SecurityExpressionRoot implements MethodSecurityExpressionOperations {
	  
    private Logger LOG = LoggerFactory.getLogger(MyMethodSecurityExpressionRoot.class);
  
    private Object filterObject;
    private Object returnObject;
    private Object target;
     
    public MyMethodSecurityExpressionRoot(Authentication a) {
    	super(a);
    }
 
    public  boolean adminOnly() {
    	LOG.info("haha -- check if this function is used by admin role only");
    	this.setDefaultRolePrefix(null);
    	System.out.println("this.hasAuthority(ROLE_ADMIN)"+this.hasAuthority("ROLE_ADMIN"));
    	return true;
    	//return  this.hasAuthority("ROLE_ADMIN");
    }
     
    public void setFilterObject(Object filterObject) {
        this.filterObject = filterObject;
    }
 
    public Object getFilterObject() {
        return filterObject;
    }
 
    public void setReturnObject(Object returnObject) {
        this.returnObject = returnObject;
    }
 
    public Object getReturnObject() {
        return returnObject;
    }
 
    void setThis(Object target) {
        this.target = target;
    }
 
    public Object getThis() {
        return target;
    }
 
}
