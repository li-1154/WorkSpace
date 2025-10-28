import { Component, OnInit } from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit {

  noteId: string | null = null;
  title = '';
  content = '';

  constructor(
    private noteService: NotesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
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
