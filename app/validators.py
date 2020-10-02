from django.core.validators import MinLengthValidator
from django.utils.translation import gettext_lazy as _

class UsernameValidator(MinLengthValidator):
    message = _("ユーザーネームは最低5文字必要です。")

UsernameValidator = UsernameValidator(5)
username_validators = [UsernameValidator]