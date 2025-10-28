import { Component, OnInit } from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';
import { Note } from 'src/app/models/note.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-notes-list-component',
  templateUrl: './notes-list-component.component.html',
  styleUrls: ['./notes-list-component.component.css']
})
export class NotesListComponent implements OnInit {

  constructor(private noteService:NotesService,private router:Router) { }
  
  notes:Note[]=[];
  ngOnInit(): void {
    this.noteService.getUserNotes().subscribe(notes => this.notes = notes);
  }

  addNote()
  {
    this.router.navigate(['/note/new'])
  }

  editNote(id:string)
  {
    this.router.navigate(['/note.edit',id])
  }

  deleteNote(id:string)
  {
    if(confirm('确定要删除这条笔记吗?'))
    {
      this.noteService,this.deleteNote(id);
    }
  }

}
