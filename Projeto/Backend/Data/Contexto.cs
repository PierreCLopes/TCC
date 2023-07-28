using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class Contexto : DbContext
    {
        public Contexto(DbContextOptions<Contexto> options) : base(options) 
        { 

        }

        public DbSet<Usuario> Usuario { get; set; }
    }
}
