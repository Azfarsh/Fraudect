from django.contrib import admin
from .models import User, UserRegistration

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'timestamp')  # Display username and timestamp in the admin
    search_fields = ('username',)  # Allow searching by username


class SmsMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'from_number', 'body', 'received_at')  # Display relevant fields
    search_fields = ('from_number', 'body')  # Allow searching by sender number or message body
    list_filter = ('user',)  # Filter messages by user
    ordering = ('-received_at',)  # Order by the most recent messages first# admin.py

from django.contrib import admin
from .models import UserRegistration

class UserRegistrationAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'phone_number', 'country', 'state', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('country', 'state')
    ordering = ('created_at',)
    
    # Optional: Add fieldsets for better layout in admin interface
    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'password')
        }),
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'phone_number', 'country', 'state', 'country_code'),
        }),
        ('Date Information', {
            'fields': ('created_at',),
        }),
    )
    
    # Optionally hide password field in the admin interface
    def get_readonly_fields(self, request, obj=None):
        if obj:  # if editing an existing user
            return ['password']  # make password field read-only
        return []

admin.site.register(UserRegistration, UserRegistrationAdmin)

    