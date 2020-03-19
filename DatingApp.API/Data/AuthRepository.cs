using System;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Method to login the user
        /// </summary>
        /// <param name="username">username</param>
        /// <param name="password">password</param>
        /// <returns>Returns null if username or password is incorrect else returns user details</returns>
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.Include(p=> p.Photos).FirstOrDefaultAsync(x => x.Username == username);
            if (user == null)
            {
                return null;
            }

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }

            return user;
        }

        /// <summary>
        /// Method to register the user to database
        /// </summary>
        /// <param name="user">username</param>
        /// <param name="password">password</param>
        /// <returns>Returns the created user</returns>
        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        /// <summary>
        /// Method to check if the User Exists
        /// </summary>
        /// <param name="username">username</param>
        /// <returns>True if user already exists else returns false</returns>
        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(x => x.Username == username))
            {
                return true;
            }

            return false;
        }

        /// <summary>
        /// Method to get hashed password
        /// </summary>
        /// <param name="password">password to be hashed</param>
        /// <param name="passwordHash">return the hashed password as out parameter</param>
        /// <param name="passwordSalt">return the hash key as password salt</param>
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        /// <summary>
        /// Method to verify the password Hash
        /// </summary>
        /// <param name="password">password by the user</param>
        /// <param name="passwordHash">hashed password from database</param>
        /// <param name="passwordSalt">salt key from database</param>
        /// <returns></returns>
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
            }
            return true;
        }
    }
}