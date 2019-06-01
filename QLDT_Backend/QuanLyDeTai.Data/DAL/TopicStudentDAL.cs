﻿using QuanLyDeTai.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyDeTai.Data.DAL
{
    public class TopicStudentDAL
    {
        private DefaultDbContent context = new DefaultDbContent();

        public TopicStudent GetById(long id)
        {
            //Get from database
            var user = context.TopicStudents
                .Where(i => i.ID == id)
                .FirstOrDefault();
            return user;
        }


        public TopicStudent GetByStudentPracticeId(long id)
        {
            //Get from database
            var user = context.TopicStudents
                .Where(i => i.StudentPracticeID == id && i.Status==true)
                .FirstOrDefault();
            return user;
        }


        public TopicStudent CheckTopicUser(long id)
        {
            //Get from database
            var user = from d in context.TopicStudents
                       join t in context.StudentPracticeRelationships on d.StudentPracticeID equals t.ID
                       where d.StudentPracticeID == id 
                       select d;
            return user.FirstOrDefault();
        }

        public Topic getTopicChoose(long id)
        {
            //Get from database
            var user = from d in context.TopicStudents
                       join t in context.StudentPracticeRelationships on d.StudentPracticeID equals t.ID
                       join x in context.Topics on d.TopicID equals x.ID
                       where d.StudentPracticeID == id && d.Status==true
                       select x;
            return user.FirstOrDefault();
        }

        public IQueryable GetListByTopicId(long tpid)
        {

            context.Configuration.ProxyCreationEnabled = false;
            //Get from database
            var user = from d in context.TopicStudents
                       join t in context.StudentPracticeRelationships on d.StudentPracticeID equals t.ID
                       join s in context.Students on t.StudentID equals s.ID
                       join tp in context.Topics on d.TopicID equals tp.ID
                       where d.TopicID == tpid
                       select new
                       {
                           ID = d.ID,
                           StudentID = s.MaSV,
                           Order = d.Order,
                           Status = d.Status,
                           CreateTime=d.CreateTime,
                           FirstName = s.FirstName,
                           LastName = s.LastName,
                           Birthday = s.Birthday,
                           Email = s.Email,
                           Phone = s.Phone
                       };
            return user.OrderBy(i=>i.CreateTime);
        }

        public int getCount(long tpid)
        {

            context.Configuration.ProxyCreationEnabled = false;
            //Get from database
            var user = from d in context.TopicStudents
                       join t in context.StudentPracticeRelationships on d.StudentPracticeID equals t.ID
                       join s in context.Students on t.StudentID equals s.ID
                       join tp in context.Topics on d.TopicID equals tp.ID
                       where d.TopicID == tpid
                       select new
                       {
                           ID = d.ID,
                           StudentID = s.ID,
                           Order=d.Order,
                           Status=d.Status,
                           FirstName = s.FirstName,
                           LastName = s.LastName,
                           Birthday = s.Birthday,
                           Email = s.Email,
                           Phone = s.Phone
                       };
            return user.Count();
        }

        public TopicStudent ChangeStatus(long id)
        {
            context.Configuration.ProxyCreationEnabled = false;
            //Get from database
            var user = context.TopicStudents
                .Where(i => i.ID == id)
                .FirstOrDefault();
            if (user.Status == null)
            {
                user.Status = true;
            }
            else
            {
                user.Status = !user.Status;
            }
            context.SaveChanges();
            return user;
        }

        public bool Update(TopicStudent model)
        {
            try
            {
                //Get item user with Id from database
                var item = context.TopicStudents.Where(i => i.ID == model.ID).FirstOrDefault();

                //Set value item with value from model
                item.Status = model.Status;
                
                item.ModifiedBy = model.ModifiedBy;
                item.ModifiedTime = DateTime.Now;

                //Save change to database
                context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool Create(TopicStudent model)
        {
            try
            {
                //Initialization empty item
                var item = new TopicStudent();

                //Set value for item with value from model
                item.TopicID = model.TopicID;
                item.StudentPracticeID = model.StudentPracticeID;
                item.Order = model.Order;
                item.CreateBy = model.CreateBy;
                item.CreateTime = DateTime.Now;

                //Add item to entity
                context.TopicStudents.Add(item);
                //Save to database
                context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool Delete(long id)
        {
            try
            {
                //Tương tự update
                var item = context.TopicStudents.Where(i => i.ID == id).FirstOrDefault();

                //Remove item.

                context.TopicStudents.Remove(item);

                //Change database
                context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}