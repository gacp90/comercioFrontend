import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ENVIRONMENT
import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http:HttpClient) { }

  /** ================================================================
   *   GET TOKEN
  ==================================================================== */
  get token():string {
    return localStorage.getItem('token') || '';
  }

  /** ================================================================
   *   GET HEADERS
  ==================================================================== */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  /** ================================================================
   *  LOAD TASKS
  ==================================================================== */
  loadTasks(query: any){
    return this.http.post<{ok: boolean, tasks: Task[], total:number}>( `${base_url}/tasks/query`, query, this.headers );
  }

  /** ================================================================
   *  CREATE TASK
  ==================================================================== */
  createTask(formData: any){
    return this.http.post<{ok: Boolean, task: Task}>(`${base_url}/tasks`, formData, this.headers);
  }

  /** ================================================================
   *  UPDATE TASK
  ==================================================================== */
  updateTask(formData: any, id: string){
    return this.http.put<({ok: Boolean, task: Task})>(`${base_url}/tasks/${id}`, formData, this.headers);
  }

  /** ================================================================
   *  UPDATE TASK
  ==================================================================== */
  deleteTask(id: string){
    return this.http.delete<({ok: Boolean, msg: string})>(`${base_url}/tasks/${id}`, this.headers);
  }


  // FIN DE LA CLASE
}
