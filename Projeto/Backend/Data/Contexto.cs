using Backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class Contexto : IdentityDbContext
    {
        public Contexto(DbContextOptions<Contexto> options) : base(options) 
        { 

        }

        public DbSet<Usuario> Usuario { get; set; }
    }
}
