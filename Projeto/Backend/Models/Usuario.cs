using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    [Table("USUARIO")]
    public class Usuario
    {
        [Key]
        [Column("HANDLE")]
        public int Handle { get; set; }
    }
}