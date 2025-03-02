using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.IO.Pipelines;
using System.Net;
using static Microsoft.AspNetCore.Http.HttpContext;
using Microsoft.EntityFrameworkCore;
namespace backend.Controllers;

public class MainController : Controller
{
    private readonly ILogger<MainController> _logger;

    private readonly PostgresContext _dbcontext;
    public MainController(ILogger<MainController> logger, PostgresContext context)
    {
        _logger = logger;
        this._dbcontext = context;
    }
    public IActionResult Logout()
    {   
        HttpContext.Session.Clear();
        foreach (var cookie in Request.Cookies.Keys)
        {
            Response.Cookies.Delete(cookie);
        }
        return RedirectToAction("Index","Home");
    }
    public IActionResult Content()
    {
        return View();
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers(int page = 1, int pageSize = 5, string searchQuery = "")
    {
        var query = from u in _dbcontext.Userlogins
                   join ud in _dbcontext.Userdetails on u.Userid equals ud.Userid
                   join ur in _dbcontext.Userroles on u.Roleid equals ur.Roleid
                   where !u.Isdeleted
                   select new {
                       u.Userid,
                       ud.Firstname,
                       ud.Lastname,
                       u.Email,
                       ud.Phonenumber,
                       Role = ur.Rolename,
                       ud.Status
                   };

        if (!string.IsNullOrEmpty(searchQuery))
        {
            query = query.Where(u => 
                u.Firstname.Contains(searchQuery) || 
                u.Lastname.Contains(searchQuery) || 
                u.Email.Contains(searchQuery)
            );
        }

        var totalItems = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var response = new PaginatedResponse<dynamic>
        {
            Items = items,
            TotalItems = totalItems,
            PageNumber = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
        };

        return Json(response);
    }
}