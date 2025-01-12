(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();class w{constructor(e){this.value=0,this.candidates=(1<<e)-1}setValue(e){this.value=e,this.candidates=0}hasValue(){return this.value!==0}getValue(){return this.value}clearCandidate(e){this.candidates&=~(1<<e-1)}setMaxCandidate(e){return this.value!==0?this.value<=e:(this.candidates=this.candidates&(1<<e)-1,this.candidates!==0)}isCandidate(e){return this.value!==0?this.value===e:(this.candidates&1<<e-1)!==0}isValid(){return this.value!==0||this.candidates!==0}}class V{constructor(e){this.size=e,this.cells=Array.from({length:e},()=>Array.from({length:e},()=>new w(e))),this.rowSegments=Array.from({length:e},()=>Array.from({length:e},()=>[e])),this.colSegments=Array.from({length:e},()=>Array.from({length:e},()=>[e]))}getCell(e,t){return this.cells[e][t]}getRow(e){return this.cells[e]}getCol(e){return this.cells.map(t=>t[e])}getRowSegments(e){return this.rowSegments[e]}getColSegments(e){return this.colSegments[e]}setRowSegments(e,t){this.rowSegments[e]=t;let s=0;for(let n=0;n<t.length;n++){const r=t[n];for(let o=0;o<r;o++){if(!this.cells[e][s].setMaxCandidate(r))return!1;s++}}return!0}setColSegments(e,t){this.colSegments[e]=t;let s=0;for(let n=0;n<t.length;n++){const r=t[n];for(let o=0;o<r;o++){if(!this.cells[s][e].setMaxCandidate(r))return!1;s++}}return!0}getBoundaries(e,t){let s=[t===0,t===this.size-1,e===0,e===this.size-1];const n=this.rowSegments[e];let r=0;for(let a=0;a<n.length;a++)r+=n[a],r===t?s[0]=!0:r==t+1&&(s[1]=!0);const o=this.colSegments[t];let i=0;for(let a=0;a<o.length;a++)i+=o[a],i===e?s[2]=!0:i==e+1&&(s[3]=!0);return s}}class L{constructor(e){this.container=e}render(e){this.container.innerHTML="";const t=document.createElement("table"),s=e.size;for(let n=0;n<s;n++){const r=document.createElement("tr");for(let o=0;o<s;o++){const i=document.createElement("td");i.textContent=e.getCell(n,o).getValue();const a=e.getBoundaries(n,o);a[0]&&i.classList.add("segment-left"),a[2]&&i.classList.add("segment-top"),n===s-1&&i.classList.add("segment-bottom"),o===s-1&&i.classList.add("segment-right"),r.appendChild(i)}t.appendChild(r)}this.container.appendChild(t)}}function C(l,e,t,s){const n=l[e][t];for(let r=s;r>n;r--){l[e][t]=r;let o=b(l,e)&&v(l,t);if(l[e][t]=n,o)return r}return 0}function m(l){const e=l.length;return l.some(s=>s<1||s>e)?!1:new Set(l).size===e}function p(l){const e=l.length,t=new Array(e+1).fill(!1);t[0]=!0;for(let s=1;s<=e;s++)for(let n=0;n<s;n++)if(t[n]){const r=l.slice(n,s);if(m(r)){t[s]=!0;break}}return t[e]}function b(l,e){return p(l[e])}function v(l,e){const t=l.map(s=>s[e]);return p(t)}function g(l){const e=l.length,t=new Array(e+1).fill(-1);t[0]=0;for(let r=1;r<=e;r++)for(let o=0;o<r;o++)if(t[o]!==-1&&m(l.slice(o,r))){t[r]=o;break}if(t[e]===-1)return[];const s=[];let n=e;for(;n>0;){const r=t[n];s.push(n-r),n=r}return s.reverse(),s}function A(l){const e=l.size,t=[],s=[];for(let n=0;n<e;n++){const r=g(l.getRow(n).map(o=>o.getValue()));t.push(r)}for(let n=0;n<e;n++){const r=g(l.getCol(n).map(o=>o.getValue()));s.push(r)}return{rowSegments:t,colSegments:s}}class I{static generate(e){const t=e;for(var s=Array.from({length:t},()=>Array(t).fill(1));;){let i=0;for(let u=0;u<t;u++)for(let f=0;f<t;f++)i=Math.max(i,s[u][f]);i<t&&i++;let a=[],d=0;for(let u=0;u<t;u++)for(let f=0;f<t;f++){const h=C(s,u,f,i);if(h>0){if(h>d)a=[],d=h;else if(h<d)continue;a.push([u,f,h])}}if(a.length===0)break;const[c,y,S]=a[Math.floor(Math.random()*a.length)];s[c][y]=S}const n=new V(t);for(let i=0;i<t;i++)for(let a=0;a<t;a++)n.getCell(i,a).setValue(s[i][a]);const{rowSegments:r,colSegments:o}=A(n);for(let i=0;i<t;i++)n.setRowSegments(i,r[i]);for(let i=0;i<t;i++)n.setColSegments(i,o[i]);return n}}function M(l){return x(l)>l.size-2&&!E(l)}function x(l){const e=l.size;let t=0;for(let s=0;s<e;s++)for(let n=0;n<e;n++)t=Math.max(t,l.getCell(s,n).getValue());return t}function E(l){const e=l.size;if(e===0)return!1;const t=new Set,s=[[0,0]];for(t.add("0,0");s.length>0;){const[n,r]=s.shift(),[o,i,a,d]=l.getBoundaries(n,r);if(r>0&&!o){const c=`${n},${r-1}`;t.has(c)||(t.add(c),s.push([n,r-1]))}if(r<e-1&&!i){const c=`${n},${r+1}`;t.has(c)||(t.add(c),s.push([n,r+1]))}if(n>0&&!a){const c=`${n-1},${r}`;t.has(c)||(t.add(c),s.push([n-1,r]))}if(n<e-1&&!d){const c=`${n+1},${r}`;t.has(c)||(t.add(c),s.push([n+1,r]))}}return t.size<e*e}const G=document.getElementById("size-input"),N=document.getElementById("generate-button"),R=document.getElementById("grid-container");N.addEventListener("click",()=>{const l=parseInt(G.value);let e=null,t=!1;for(;!t;)e=I.generate(l),t=M(e);new L(R).render(e)});
