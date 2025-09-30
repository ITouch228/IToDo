import os
from pathlib import Path
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database settings
    DB_USER: str = 'postgres'
    DB_PASSWORD: str = '1122'
    DB_HOST: str = 'localhost'
    DB_PORT: int = 5432
    DB_NAME: str = 'itodo'

    # JWT settings
    ALGORITHM: str = 'RS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    REFRESH_TOKEN_EXPIRE_DAYS: int = 1

    PRIVATE_KEY: str = '''-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAzQCy7Um2N7AC+1ZjFCuNgMiHomsdHO6G5aaNBuPRa36nEXEp
2dR83813nlf/7uTWq/PfNbIEC6HkpwydeAxcQ4PXHLLF+mQCEortJiqN0zr4rUJB
J/OsyLR/vMHApXsKiu+yzVOutbQxWZJQJ8MHWTFuFPkBiJQSiGl09s3lFZ4WUPZ3
eWTyYZLTTACzlHvkehmTKBo3vdGWiniUuTchiMCr6cdA3/AFfaYFP/okmpVEuzXz
qRVcdgz22QP6OS+ScVJ40dZ0NROH8ZTzRIz1i13Cd0oIyMN/g9Vfo/v5LDCMVHZ5
EIT7x+1ORajlXHZnQ+3R45n159vZOQUB1mhDIwIDAQABAoIBABculA03P67ObZfk
bfHS9v5wLr5UJIeoBYMksV/tFTp1qQjU5imm2LQqNPOn+d4W7JunST92MPTrysKF
L61qoGhWGVY6dR7afk2Afk7Jkx4m1gYprtqIuKo9lxBOTK2p20hY0LxdUS1lAguh
+wR0DnmsmEkw21aJgAsC+eIK6HPoJ8WiR/DPE/mAK4p2V5/Px1ymUZQZZWRo2nWi
MNMG9Ic8qRxJ+Apj7LoSZ6pysrbSFup0IlTsL24YziK8JsBJlbd6deSaSzKh9iZu
1TSC9gkirCogdAsmhlGmZzoj7Vo1NOOFIHtzXXXwIhQlhPsQaFwjKoeKfSICLnZt
JpbFEuECgYEA6ZFxsHhrhTLyevopsZOnd0h2oaRzMVcfTnR1l0jBfwCRzWwbJxMZ
Q3lAFvKLf4650QkZaYntX+pkM+3fOHkgX8M4RzAK39AUp4TowpkC50qEkTp2gQea
jdo5nuxWrrIoMvUvtVjz8BTUrUidGmq9VxLmufDszFyDmDGOT1EDnDMCgYEA4LDw
iE4BT1EYc0+HjiymuEavMslckTy3x0q8nA3qTYOvmYtZQTObM4bChA1yDxN/gcVI
AJpjfgnWa2beGV8M4ihYQVjVXL91eJvBclwD1hUpSaqnCF9q3u8ed/wslG3apSKM
gduQ4ESs7CUYdznNHkQuWJ9+4ramr3o6zIAVzVECgYEAwWC99BF/U8SepdrA8lkB
ae0A60uwY8VyEg6x3RNLwM7D6IP85xkU7ZxRx64AeRe+GKej9pFPiv4RAD2NdsAy
YZbL3YSVPECXGSsdWyA8GyrDH0p8GtAk0hU/Z6jdC75NMgN2AHspXDii7OUVzW1a
XeE0TfZ+16Qw/6zn2huFFakCgYAV9ZT8bUs5ej5+foZMAdclaVsUBpPyadG4O3il
c8KzYqxVwEWv1qBTb9cw2rOL/6bVgvdff7c7iTCYfIw2RJDYxYKimFD56IhNikNk
rtN9J8JKPdBnRBQIx6vdpBqjQv08aFz9D/1fvbZ8ub9jX5XJYHZ7GNNoytsNiU+X
zujSkQKBgHWtXMEZWzwuH8gT2HGNsJ+Fn7sZxTX5CjZSlipoY0qZ8frz8GwAJRoq
hqqJvmthFCmsWte8NLZ51zh/NGZH2eQy7Qj/YR36NBQ6DAowzKApwQAwZi8sU1z0
GJsd0cyQ7rmQYAfg7RWwxu7p2taKrqnhC/30jztCprhnZtvVlIfg
-----END RSA PRIVATE KEY-----'''

    PUBLIC_KEY: str = '''-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzQCy7Um2N7AC+1ZjFCuN
gMiHomsdHO6G5aaNBuPRa36nEXEp2dR83813nlf/7uTWq/PfNbIEC6HkpwydeAxc
Q4PXHLLF+mQCEortJiqN0zr4rUJBJ/OsyLR/vMHApXsKiu+yzVOutbQxWZJQJ8MH
WTFuFPkBiJQSiGl09s3lFZ4WUPZ3eWTyYZLTTACzlHvkehmTKBo3vdGWiniUuTch
iMCr6cdA3/AFfaYFP/okmpVEuzXzqRVcdgz22QP6OS+ScVJ40dZ0NROH8ZTzRIz1
i13Cd0oIyMN/g9Vfo/v5LDCMVHZ5EIT7x+1ORajlXHZnQ+3R45n159vZOQUB1mhD
IwIDAQAB
-----END PUBLIC KEY-----'''

    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent / ".env",
        env_file_encoding='utf-8',
        extra='ignore'
    )

    def get_db_url(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

settings = Settings()

# from cryptography.hazmat.primitives.asymmetric import rsa
# from cryptography.hazmat.primitives import serialization
#
# print("Generating new RSA keys...")
# private_key = rsa.generate_private_key(
#     public_exponent=65537,
#     key_size=2048
# )
# public_key = private_key.public_key()
#
# settings.PRIVATE_KEY = private_key.private_bytes(
#     encoding=serialization.Encoding.PEM,
#     format=serialization.PrivateFormat.TraditionalOpenSSL,
#     encryption_algorithm=serialization.NoEncryption()
# ).decode()
#
# settings.PUBLIC_KEY = public_key.public_bytes(
#     encoding=serialization.Encoding.PEM,
#     format=serialization.PublicFormat.SubjectPublicKeyInfo
# ).decode()
#
# print("New RSA keys generated successfully!")
