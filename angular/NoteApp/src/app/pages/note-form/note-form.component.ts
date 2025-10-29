import { Component, OnInit } from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css'],
})
export class NoteFormComponent implements OnInit {

  noteId: string | null = null;
  title = '';
  content = '';

  constructor(
    private noteService: NotesService,
    private route: ActivatedRoute,
    public router: Router,
    private afAuth:AngularFireAuth
  ) { }


  private authSub:any;
  
  ngOnInit(): void {
    
    this.authSub=this.afAuth.authState.subscribe(user=>
    {

      if(!user)
      {
        alert('请先登录');
      
      this.router.navigate(['login']);
      return;
      }
    
      this.noteId = this.route.snapshot.paramMap.get('id');
      if (this.noteId) {
        this.noteService.getNoteById(this.noteId).subscribe(
          note => {
            if (note) {
              this.title = note.title;
              this.content = note.content;
            }
          });
      
      }
    });


  }


  ngOnDestroy()
  {
    if(this.authSub)this.authSub.unsubscribe(); 
  }


  saveNote() {
    if (this.noteId) {
      this.noteService.updateNote(this.noteId,
        {
          title: this.title,
          content: this.content
        }
      ).then(
        () => this.router.navigate(['./notes'])
      );
    }
    else {
      this.noteService.addNote({ title: this.title, content: this.content })
        .subscribe(() => this.router.navigate(['/notes']))
    }
  }



}
