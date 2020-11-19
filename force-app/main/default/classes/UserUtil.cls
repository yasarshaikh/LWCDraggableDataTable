/**
 * @description       : 
 * @author            : Yasar Shaikh
 * @group             : 
 * @last modified on  : 11-19-2020
 * @last modified by  : Yasar Shaikh
 * Modifications Log 
 * Ver   Date         Author         Modification
 * 1.0   11-09-2020   Yasar Shaikh   Initial Version
**/
public with sharing class UserUtil {
    
    @AuraEnabled(cacheable = true)
    public static List<User> getUsers(){
        return [SELECT 	Id, UserName, Email 
				FROM 	USER 
				ORDER BY CREATEDDATE ASC];
    }

}